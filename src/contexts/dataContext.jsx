import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import databaseService from '../services/databaseService';
import functionsService from "../services/functionsService";
import { useAuth } from './authContext';
import { useLoading } from './loadingContext';

const timeStampFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",  
  month: "numeric",  
  year: "numeric",  
  hour: "numeric",  
  minute: "numeric",  
  timeZoneName: 'short'
})

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",  
  month: "numeric",  
  year: "numeric"
})

const findSampleData = (sampleID, scanners) => {
  if (scanners) {
    for (const scanner of scanners) {
      const sampleData = scanner.samples.find(scannerSample => scannerSample.sampleID === sampleID);
      if (sampleData) return sampleData;
    }
  }
  return undefined;
};

const reformatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // Months are 0-indexed, so add 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toDailyAverages = (dataArr, timestampKey, valueKey, keysToPassThrough=[]) => {
  const dailyData = {};
  for (const item of dataArr) {
    const timestamp = reformatDate(item[timestampKey]);
    if (!(timestamp in dailyData)) {
      dailyData[timestamp] = { values: [], passThrough: {} };
    }
    dailyData[timestamp].values.push(item[valueKey]);
    keysToPassThrough.forEach(k => dailyData[timestamp].passThrough[k] = item[k]);
  }

  Object.entries(dailyData).forEach(([k,obj]) => {
    dailyData[k].dailyAverage = obj.values.reduce((a,b) => a+b,0) / obj.values.length;
  });

  const sortedDailyData = Object.keys(dailyData).sort();

  return sortedDailyData.map(k => {
    return {
      x: k,
      y: dailyData[k].dailyAverage,
      ...dailyData[k].passThrough
    };
  });
};

const getDataForUser = async (updateLoading, setUserData, setScanners, setFields, setPlants, getNewSamples) => {
  updateLoading(['userData', 'newSamples'],[]);

  const allCurrentData = await databaseService.getInitData();

  console.log(allCurrentData);

  if (allCurrentData?.error) {
    // In case of error, everything gets set to null
    setUserData(null);
    setScanners(null);
    setFields(null);
    setPlants(null);
    updateLoading([], ['userData', 'newSamples']);
  } else {
    // Store the new data in state
    setUserData({
      authID: allCurrentData.authID,
      id: allCurrentData.$id,
    });

    setScanners(allCurrentData.scanners || null);
    setFields(allCurrentData.fields || null);
    setPlants(allCurrentData.plants || null);

    // Get any new stuff from the trinamiX database in the background
    await getNewSamples(allCurrentData.scanners);

    updateLoading([],['userData']);
  }
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [scanners, setScanners] = useState(null);
  const [fields, setFields] = useState(null);
  const [plants, setPlants] = useState(null);

  const { userAuth } = useAuth();
  const { updateLoading } = useLoading();

  useEffect(() => {
    (async () => {
      if (userAuth) {
        await getDataForUser(updateLoading, setUserData, setScanners, setFields, setPlants, getNewSamples);
      }
    })();
  }, [userAuth]);

  const getNewSamples = async (currentScannerState) => {
    updateLoading(['newSamples'],[]);

    const fetchScanners = currentScannerState.map(scannerObj => scannerObj.scannerID)

    // Get the new samples
    const results = await functionsService.getNewSamples(fetchScanners);

    console.log(results);
    
    // Update the current information with the new samples
    const newScanners = JSON.parse(JSON.stringify(currentScannerState));
    for (const [scannerId, newSamples] of Object.entries(results.data)) {
      const scannerIdx = newScanners.findIndex(s => s.scannerID === scannerId);
      for (const sample of newSamples) {
        // Add new sample or update existing sample (since it was updated)
        const sampleIdx = newScanners[scannerIdx].samples.findIndex(s => s.sampleID === sample.sampleID);
        if (sampleIdx >= 0) {
          newScanners[scannerIdx].samples[sampleIdx] = sample;
        } else {
          newScanners[scannerIdx].samples.push(sample);
        }
      }
    }

    setScanners(newScanners);

    updateLoading([], ['newSamples']);
  };

  const addScannerToUserAccount = async (newScannerID) => {
    const currentScanners = scanners === null ? [] : scanners.map(s => s['$id']);
    const newScannerData = await databaseService.addScannerToUserAccount(newScannerID, currentScanners, userData.id);
        
    let successful;
    if (newScannerData.error) {
      // Handle error
      successful = false;
    } else {
      // Handle adding new scanner data to state
      setScanners([ ...scanners, newScannerData.data ]);
      successful = true;
    }
    return successful;
  };

  const removeScannerFromUserAccount = async (removeScannerID) => {
    // Find scanner in users' scanner list
    const scannerToRemove = scanners.find(s => s['scannerID'] === removeScannerID);
    if (scannerToRemove) {
      updateLoading(['removeScanner'],[]);
      
      const currentScanners = scanners.map(s => s['$id']);
      const successful = await databaseService.removeScannerFromUserAccount(scannerToRemove['$id'], currentScanners, userData.id);

      const sampleIDsToRemove = scannerToRemove.samples.map(s => s.sampleID);
      for (const plant of plants) {
        const newPlantSamples = plant.samples.filter(s => !sampleIDsToRemove.includes(s.sampleID)).map(s => s.sampleID);
        if (newPlantSamples.length !== plant.samples.length) {
          await updatePlant({ ...plant, samples: newPlantSamples });
        }
      }
      
      if (successful) {
        // Update all user data to remove scanner from local state
        await getDataForUser(updateLoading, setUserData, setScanners, setFields, setPlants, getNewSamples);
        toast.success('Successfully removed scanner from your account.');
      }
  
      updateLoading([], ['removeScanner']);
      return successful;
    } else {
      toast.error('This scanner is not associated with your account.');
      return false;
    }
  };

  const sampleTableData = useMemo(() => {
    const rows = [];
    if (scanners && plants) {
      for (const scanner of scanners) {
        const scannerID = scanner.scannerID;
        for (const sample of scanner.samples) {
          const plantsWithSample = plants.filter(plant => plant.samples.some(s => s.sampleID === sample.sampleID));
          
          rows.push({
            href: `/samples/${sample.sampleID}`,
            scannerID,
            sampleID: sample.sampleID,
            modelResult: sample.modelResult,
            timestamp: timeStampFormatter.format(new Date(sample.timestamp)),
            unformattedTimestamp: sample.timestamp,
            inXPlants: plantsWithSample.length
          });
        }
      }
    }
    return rows;
  }, [scanners, plants]);

  const getSampleInformation = (sampleID) => {
    if (scanners === null || plants === null) return null;
    try {
      const scanner = scanners.find(scanner => scanner.samples.some(sample => sample.sampleID === sampleID));
      const sample = scanner.samples.find(sample => sample.sampleID === sampleID);
      const plantsWithSample = plants.filter(plant => plant.samples.some(s => s.sampleID === sampleID));

      return {
        timestamp: timeStampFormatter.format(new Date(sample.timestamp)).replace(',',''),
        sampleID: sample.sampleID,
        scannerID: scanner.scannerID,
        modelResult: sample.modelResult,
        measurementIDs: sample.measurementIds,
        plantsWithSample: plantsWithSample.map(p => ({ name: p.name, plantID: p.plantID, numSamples: p.samples.length }))
      };
    } catch (e) {
      console.error(e);
      toast.error('Unable to locate sample data.');
      return null;
    }
  };

  const plantTableData = useMemo(() => {
    const rows = [];
    if (scanners && plants && fields) {
      for (const plant of plants) {
        const latestSample = plant.samples.reduce((latestSample, sample) => {
          const sampleData = findSampleData(sample.sampleID, scanners);
          if (sampleData && (latestSample === null || sampleData.timestamp < latestSample.timestamp)) {
            latestSample = sampleData;
          }
          return latestSample;
        }, null);
        
        const fieldsWithPlant = fields.filter(field => field.plants.some(f => f.$id === plant.$id));

        rows.push({
          href: `/plants/${plant.plantID}`,
          plantName: plant.name,
          plantID: plant.plantID,
          plant$ID: plant.$id,
          latestMoisture: latestSample ? latestSample.modelResult : null,
          latestTimestamp: latestSample ? timeStampFormatter.format(new Date(latestSample.timestamp)) : null,
          unformattedLatestTimestamp: latestSample ? latestSample.timestamp : null,
          hasXSamples: plant.samples.length,
          inXFields: fieldsWithPlant.length
        });
      }
    }
    return rows;
  }, [scanners, plants, fields]);

  const getPlantInformation = (plantID) => {
    if (plants === null) return null;
    try {
      const numericPlantID = parseInt(plantID);
      const plant = plants.find(p => p.plantID === numericPlantID);
      
      const sampleIDs = plant.samples.map(sample => sample.sampleID);
      const plantSampleTableData = sampleTableData.filter(row => sampleIDs.includes(row.sampleID));
      const averageMoisture = plantSampleTableData.length > 0 ? plantSampleTableData.reduce((s,v) => v.modelResult + s, 0) / plantSampleTableData.length : null;
      
      const fieldIDs = fields.filter(field => field.plants.some(f => f.$id === plant.$id)).map(f => f.fieldID);
      const plantFieldTableData = fieldTableData.filter(row => fieldIDs.includes(row.fieldID));

      return {
        plantName: plant.name,
        plantID: numericPlantID,
        averageMoisture: averageMoisture,
        fieldsTableData: plantFieldTableData,
        samplesTableData: plantSampleTableData
      };
    } catch (e) {
      console.error(e);
      toast.error('Unable to locate plant data.');
      return null;
    }
  };

  const createNewPlant = async (name, sampleIDs) => {
    if (scanners === null || plants === null) return false;
    try {
      // Convert list of sampleIDs to sample objects
      const newSamples = sampleIDs.map(sampleID => {
        const scanner = scanners.find(scanner => scanner.samples.some(sample => sample.sampleID === sampleID));
        const sample = scanner.samples.find(sample => sample.sampleID === sampleID);
        return sample;
      });

      const results = await databaseService.createDocument(
        'plants',
        {
          name,
          plantID: Date.now(),
          samples: newSamples.map(s => s['$id'])
        },
        userData.authID
      );

      // Finish by editing plants state and handling errors
      let successful;
      if (results.error) {
        // Handle error
        successful = false;
      } else {
        // Handle adding to plants state
        const newPlants = JSON.parse(JSON.stringify(plants));
        newPlants.push(results);
        setPlants(newPlants);
        successful = true;
      }
      return successful;
    } catch (e) {
      console.error(e);
      toast.error('Failed to create plant.');
      return false;
    }
  };

  const updatePlant = async (newPlantObj) => {
    if (scanners === null || plants === null) return false;
    try {
      // Convert list of sampleIDs to sample objects
      const newSamples = newPlantObj.samples.map(sampleID => {
        const scanner = scanners.find(scanner => scanner.samples.some(sample => sample.sampleID === sampleID));
        const sample = scanner.samples.find(sample => sample.sampleID === sampleID);
        return sample;
      });
      
      // Update plant in database
      const results = await databaseService.updateDocument(
        'plants',
        newPlantObj['$id'],
        {
          name: newPlantObj.name,
          plantID: newPlantObj.plantID,
          samples: newSamples.map(s => s['$id'])
        }
      );
      let successful;
      if (results.error) {
        // Handle error
        successful = false;
      } else {
        // Handle updating plant in state
        newPlantObj.samples = newSamples;
        const plantObjIndex = plants.findIndex(plant => plant.plantID === newPlantObj.plantID);
        const newPlants = JSON.parse(JSON.stringify(plants));
        newPlants[plantObjIndex] = newPlantObj;
        setPlants(newPlants);
        successful = true;
      }
      return successful;
    } catch (e) {
      console.error(e);
      toast.error('Failed to update plant.');
      return false;
    }
  };

  const deletePlant = async (row) => {
    if (confirm('Are you sure that you want to delete this plant?')) {
      if (fields === null || plants === null) return false;
      try {
        // Find plant to delete to get the $id from
        const plantToDelete = plants.find(p => p.plantID === row.plantID);

        // Delete the plant from the database
        const results = await databaseService.deleteDocument(
          'plants',
          plantToDelete.$id
        );

        // Finish by editing state and handling errors
        let successful;
        if (results.error) {
          // Handle error
          successful = false;
        } else {
          // Handle removing from plants state
          const newPlants = plants.filter(p => p.plantID !== row.plantID);
          setPlants(newPlants);

          // Remove the plant from fields in database and state
          for (const f of fields) {
            const newPlants = f.plants.filter(p => p.plantID !== row.plantID);
            if (f.plants.length !== newPlants.length) {
              await updateField({
                ...f,
                plants: newPlants.map(p => p.plantID)
              });
            }
          }

          successful = true;
        }
        return successful;
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete plant.');
        return false;
      }
    }
  };

  const fieldTableData = useMemo(() => {
    const rows = [];
    if (scanners && plants && fields) {
      for (const field of fields) {
        const plant$IDs = field.plants.map(p => p.$id);
        
        let numSamplesInField = 0;
        let latestDay = null;
        let latestDailySamples = [];
        let latestFromPlants = [];
        for (const plant of plants) {
          if (plant$IDs.includes(plant.$id)) {
            plant.samples.forEach(s => {
              const sampleData = findSampleData(s.sampleID, scanners);
              if (sampleData) {
                numSamplesInField += 1;
                const sampleDay = sampleData.timestamp.slice(0,10);
                if (latestDay === null || latestDay < sampleDay) {
                  latestDay = sampleDay;
                  latestDailySamples = [sampleData];
                  latestFromPlants = [plant.plantID];
                } else if (sampleDay === latestDay) {
                  latestDailySamples.push(sampleData);
                  if (!latestFromPlants.includes(plant.plantID)) {
                    latestFromPlants.push(plant.plantID);
                  }
                }
              }
            });
          }
        }

        const latestAvgMoisture = Math.round(latestDailySamples.reduce((a,b) => a+b.modelResult,0) / latestDailySamples.length * 10) / 10;
        
        rows.push({
          href: `/fields/${field.fieldID}`,
          fieldName: field.name,
          fieldID: field.fieldID,
          latestAvgMoisture: isNaN(latestAvgMoisture) ? null : latestAvgMoisture,
          latestDay: latestDay === null ? null : dayFormatter.format(new Date(latestDay)),
          unformattedLatestDay: latestDay === null ? null : latestDay,
          fromXSamples: latestDailySamples.length,
          fromXPlants: latestFromPlants.length,
          hasXPlants: field.plants.length,
          hasXSamples: numSamplesInField
        });
      }
    }
    return rows;
  }, [scanners, plants, fields]);

  const getFieldInformation = (fieldID) => {
    if (fields === null) return null;
    try {
      const numericFieldID = parseInt(fieldID);
      const field = fields.find(f => f.fieldID === numericFieldID);
      
      const plant$IDs = field.plants.map(p => p.$id);
      const fieldPlantTableData = plantTableData.filter(row => plant$IDs.includes(row.plant$ID));

      const sampleIDs = [];
      for (const plant of plants) {
        if (plant$IDs.includes(plant.$id)) {
          plant.samples.forEach(s => sampleIDs.push(s.sampleID));
        }
      }

      const fieldSampleTableData = sampleTableData.filter(row => sampleIDs.includes(row.sampleID));
      
      return {
        fieldName: field.name,
        fieldID: numericFieldID,
        scatterChartData: fieldSampleTableData.length === 0 ? null : fieldSampleTableData.map(({ unformattedTimestamp, modelResult, scannerID, sampleID }) => ({ x: new Date(unformattedTimestamp).getTime(), y: modelResult, dateString: unformattedTimestamp, scannerID, sampleID })),
        lineChartData: fieldSampleTableData.length === 0 ? null : toDailyAverages(fieldSampleTableData, 'unformattedTimestamp', 'modelResult'),
        plantsTableData: fieldPlantTableData,
        samplesTableData: fieldSampleTableData
      };
    } catch (e) {
      console.error(e);
      toast.error('Unable to locate field data.');
      return null;
    }
  };

  const createNewField = async (name, plantIDs) => {
    if (scanners === null || fields === null || plants === null) return false;
    try {
      // Convert list of plantIDs to plant objects
      const newPlants = plants.filter(plantObj => plantIDs.includes(plantObj.plantID));

      const results = await databaseService.createDocument(
        'fields',
        {
          name,
          fieldID: Date.now(),
          plants: newPlants.map(p => p['$id'])
        },
        userData.authID
      );

      // Finish by editing fields state and handling errors
      let successful;
      if (results.error) {
        // Handle error
        successful = false;
      } else {
        // Handle adding to fields state
        const newFields = JSON.parse(JSON.stringify(fields));
        newFields.push(results);
        setFields(newFields);
        successful = true;
      }
      return successful;
    } catch (e) {
      console.error(e);
      toast.error('Failed to create field.');
      return false;
    }
  };

  const updateField = async (newFieldObj) => {
    if (scanners === null || fields === null || plants === null) return false;
    try {
      // Convert list of plantIDs to plant objects
      const newPlants = plants.filter(plantObj => newFieldObj.plants.includes(plantObj.plantID));
      
      // Update field in database
      const results = await databaseService.updateDocument(
        'fields',
        newFieldObj['$id'],
        {
          name: newFieldObj.name,
          fieldID: newFieldObj.fieldID,
          plants: newPlants.map(s => s['$id'])
        }
      );

      let successful;
      if (results.error) {
        // Handle error
        successful = false;
      } else {
        // Handle updating field in state
        newFieldObj.plants = newPlants;
        const fieldObjIndex = fields.findIndex(field => field.fieldID === newFieldObj.fieldID);
        const newFields = JSON.parse(JSON.stringify(fields));
        newFields[fieldObjIndex] = newFieldObj;
        setFields(newFields);
        successful = true;
      }
      return successful;
    } catch (e) {
      console.error(e);
      toast.error('Failed to update field.');
      return false;
    }
  };

  const deleteField = async (row) => {
    if (confirm('Are you sure that you want to delete this field?')) {
      if (fields === null) return false;
      try {
        // Find field to delete to get the $id from
        const fieldToDelete = fields.find(f => f.fieldID === row.fieldID);

        // Delete the field from the database
        const results = await databaseService.deleteDocument(
          'fields',
          fieldToDelete.$id
        );

        // Finish by editing state and handling errors
        let successful;
        if (results.error) {
          // Handle error
          successful = false;
        } else {
          // Handle removing from fields state
          const newFields = fields.filter(f => f.fieldID !== row.fieldID);
          setFields(newFields);
          successful = true;
        }
        return successful;
      } catch (e) {
        console.error(e);
        toast.error('Failed to delete field.');
        return false;
      }
    }
  };

  return (
    <DataContext.Provider value={{
      userData,
      scanners,
      fields,
      plants,
      addScannerToUserAccount,
      removeScannerFromUserAccount,
      sampleTableData,
      getSampleInformation,
      plantTableData,
      getPlantInformation,
      createNewPlant,
      updatePlant,
      deletePlant,
      fieldTableData,
      getFieldInformation,
      createNewField,
      updateField,
      deleteField
    }}>{ children }</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

DataProvider.propTypes = {
  children: PropTypes.node,
}
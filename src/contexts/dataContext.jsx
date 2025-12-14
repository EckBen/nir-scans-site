import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import databaseService from '../services/databaseService';
// import functionsService from '../services/functionsService';
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

const toDailyAverages = (dataArr, timestampKey, valueKey, keysToPassThrough=[]) => {
  const dailyData = {};
  for (const item of dataArr) {
    const timestamp = item[timestampKey].slice(0,10) + 'T00:00:00.000+00:00';
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
        updateLoading(['userData', 'newSamples'],[]);

        const allCurrentData = await databaseService.getInitData();

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
            authID: allCurrentData[0].authID,
            id: allCurrentData[0].$id,
          });
  
          setScanners(allCurrentData[0].scanners);
          setFields(allCurrentData[0].fields);
          setPlants(allCurrentData[0].plants);

          // Get any new stuff from the trinamiX database in the background
          await getNewSamples(allCurrentData[0].scanners);

          updateLoading([],['userData']);
        }
      }
    })();
  }, [userAuth]);

  const getNewSamples = async (currentScannerState) => {
    updateLoading(['newSamples'],[]);
    console.log('Stubbed out getNewSamples call', currentScannerState);
    // const fetchScanners = currentScannerState.map(scannerObj => scannerObj.scannerID)

    // // Get the new samples
    // const results = await functionsService.getNewSamples(fetchScanners);
    
    // // Update the current information with the new samples
    // const newScanners = JSON.parse(JSON.stringify(currentScannerState));
    // for (const [scannerId, newSamples] of Object.entries(results.data)) {
    //   const scannerIdx = newScanners.findIndex(s => s.scannerID === scannerId);
    //   for (const sample of newSamples) {
    //     // Add new sample or update existing sample (since it was updated)
    //     const sampleIdx = newScanners[scannerIdx].samples.findIndex(s => s.sampleID === sample.sampleID);
    //     if (sampleIdx >= 0) {
    //       newScanners[scannerIdx].samples[sampleIdx] = sample;
    //     } else {
    //       newScanners[scannerIdx].samples.push(sample);
    //     }
    //   }
    // }

    // setScanners(newScanners);

    updateLoading([], ['newSamples']);
  };

  const addScannerToUserAccount = async (newScannerID) => {
    const currentScanners = scanners.map(s => s['$id']);
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
    // !!!!! Make sure to include Alert/Confirmation
    // !!!!! check current scanners to see if it is in the list
    // !!!!! delete all scanner related data from current state, or wait until db is updated and get fresh query for user data
  
    updateLoading(['removeScanner'],[]);

    // const currentScanners = scanners.map(s => s['$id']);
    // const newScannerData = await databaseService.addScannerToUserAccount(newScannerID, currentScanners, userData.id);
    
    let successful = false;
    console.log(removeScannerID);

    // let successful;
    // if (newScannerData.error) {
    //   // Handle error
    //   successful = false;
    // } else {
    //   // Handle adding new scanner data to state
    //   setScanners([ ...scanners, newScannerData.data ]);
    //   successful = true;
    // }

    updateLoading([], ['removeScanner']);
    return successful;
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

      // const x = plantsWithSample.map(p => ({ name: p.name, plantID: p.plantID, numSamples: p.samples.length }))

      return {
        timestamp: timeStampFormatter.format(new Date(sample.timestamp)).replace(',',''),
        sampleID: sample.sampleID,
        scannerID: scanner.scannerID,
        modelResult: sample.modelResult,
        measurementIDs: sample.measurementIds,
        // plantsWithSample: x.concat(x).concat(x).concat(x).concat(x)
        plantsWithSample: plantsWithSample.map(p => ({ name: p.name, plantID: p.plantID, numSamples: p.samples.length }))
      };
    } catch (e) {
      console.error(e);
      toast.error('Unable to locate sample data.');
      // Toast.show({
      //   type: 'error',
      //   text1: 'Unable to locate sample data.',
      //   visibilityTime: 3000,
      //   autoHide: true
      // });
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
          latestMoisture: latestSample.modelResult,
          latestTimestamp: timeStampFormatter.format(new Date(latestSample.timestamp)),
          unformattedLatestTimestamp: latestSample.timestamp,
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
      
      const fieldIDs = fields.filter(field => field.plants.some(f => f.$id === plant.$id)).map(f => f.fieldID);
      const plantFieldTableData = fieldTableData.filter(row => fieldIDs.includes(row.fieldID));

      return {
        plantName: plant.name,
        plantID: numericPlantID,
        scatterChartData: plantSampleTableData.map(({ unformattedTimestamp, modelResult, scannerID, sampleID }, i) => ({ i, x: unformattedTimestamp, y: modelResult, scannerID, sampleID })),
        lineChartData: toDailyAverages(plantSampleTableData, 'unformattedTimestamp', 'modelResult'),
        fieldsTableData: plantFieldTableData,
        samplesTableData: plantSampleTableData
      };
    } catch (e) {
      console.error(e);
      toast.error('Unable to locate plant data.');
      // Toast.show({
      //   type: 'error',
      //   text1: 'Unable to locate plant data.',
      //   visibilityTime: 3000,
      //   autoHide: true
      // });
      return null;
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
                if (latestDay === null || sampleDay < latestDay) {
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
          latestAvgMoisture: isNaN(latestAvgMoisture) ? '--' : latestAvgMoisture,
          latestDay: latestDay === null ? '--' : dayFormatter.format(new Date(latestDay)),
          unformattedLatestDay: latestDay === null ? '--' : latestDay,
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
        scatterChartData: fieldSampleTableData.map(({ unformattedTimestamp, modelResult, scannerID, sampleID }) => ({ x: unformattedTimestamp, y: modelResult, scannerID, sampleID })),
        lineChartData: toDailyAverages(fieldSampleTableData, 'unformattedTimestamp', 'modelResult'),
        plantsTableData: fieldPlantTableData,
        samplesTableData: fieldSampleTableData
      };
    } catch (e) {
      console.error(e);
      toast.error('Unable to locate field data.');
      // Toast.show({
      //   type: 'error',
      //   text1: 'Unable to locate field data.',
      //   visibilityTime: 3000,
      //   autoHide: true
      // });
      return null;
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
      fieldTableData,
      getFieldInformation
    }}>{ children }</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

DataProvider.propTypes = {
  children: PropTypes.node,
}
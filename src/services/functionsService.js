import { ExecutionMethod } from "appwrite";
import { toast } from "react-toastify";

import asyncWithTimeout from './serviceHelpers';
import { config, functions } from './appwrite';

const newSamplesStub = {
  fake1: {
    "data": {}
  },
  eck_ben: {
    "data": {
      "P000000001": [
        {
          "modelResult": 10,
          "timestamp": "2025-09-26T17:31:49.089499+00:00",
          "measurementIds": [
            5972086,
            5972085,
            5972084,
            5972083,
            5972082,
            5972081,
            5972080,
            5972079,
            5972078,
            5972077
          ],
          "sampleID": "33becb75-35af-4fc0-969b-5f2936f43d6a",
          "$id": "68d7ee54001cb649f5fd",
          "$permissions": [],
          "$createdAt": "2025-09-27T12:19:28.986+00:00",
          "$updatedAt": "2025-09-27T12:19:28.986+00:00",
          "$sequence": 7,
          "$databaseId": "689261e7001977746c1f",
          "$tableId": "samples"
        },
        {
          "modelResult": 11,
          "timestamp": "2025-09-26T13:32:40.089+00:00",
          "measurementIds": [
            5972076,
            5972075,
            5972074,
            5972073,
            5972072,
            5972071,
            5972070,
            5972069,
            5972068,
            5972067
          ],
          "sampleID": "33becb75-35af-4fc0-969b-5f2936f4ffff",
          "$id": "68d7ee54001cb649ffff",
          "$permissions": [],
          "$createdAt": "2025-09-27T12:19:28.986+00:00",
          "$updatedAt": "2025-09-27T12:19:28.986+00:00",
          "$sequence": 7,
          "$databaseId": "689261e7001977746c1f",
          "$tableId": "samples"
        },
        {
          "modelResult": 0.3,
          "timestamp": "2025-08-09T12:12:12.121+00:00",
          "measurementIds": [
            5330711,
            5330712,
            5330002
          ],
          "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3",
          "$id": "68989a0c002e5cd52eae",
          "$sequence": 1,
          "$createdAt": "2025-08-10T13:09:32.824+00:00",
          "$updatedAt": "2025-08-10T14:16:52.230+00:00",
          "$permissions": [],
          "$databaseId": "689261e7001977746c1f",
          "$collectionId": "samples"
        }
      ]
    }
  }
};

const functionsService = {
  // Has the server get new data from the trinamiX database and update the appwrite database with it
  async getNewSamples(scanners) {
    let newSamples;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      newSamples = newSamplesStub[config.stub];
    } else {
      try {
        const response = await asyncWithTimeout(functions.createExecution(
          config.functionId,
          JSON.stringify({ scanners }),
          false,
          '/updateDatabase',
          ExecutionMethod.POST
        ));

        // Handles network errors
        if (response?.error) {
          throw new Error('Unknown error updating database.')
        }

        // Parse results
        const results = JSON.parse(response.responseBody);

        // Handles server errors
        if (results.error) {
          throw new Error(results.message);
        }

        newSamples = { data: results.data || {}, error: null };
      } catch (error) {
        console.error('Error updating database:', error.message);
        toast.error(error);
        newSamples = { error };
      }
    }
    return newSamples;
  }
};

export default functionsService;
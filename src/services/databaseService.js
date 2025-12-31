import { ID, Query, Permission, Role } from 'appwrite';

import asyncWithTimeout from './serviceHelpers';
import { config, database } from './appwrite';

const initDataStub = {
  fake1: [
    {
      "authID": "689e3b6f000c3e185d6f",
      "$id": "6898b50d002a093a10e6",
      "$sequence": 2,
      "$createdAt": "2025-08-10T15:04:45.741+00:00",
      "$updatedAt": "2025-08-30T14:26:00.476+00:00",
      "$permissions": [
        "read(\"user:689e3b6f000c3e185d6f\")",
        "update(\"user:689e3b6f000c3e185d6f\")"
      ],
      "scanners": [],
      "fields": [],
      "plants": [],
      "$databaseId": "689261e7001977746c1f",
      "$collectionId": "users"
    }
  ],
  eck_ben: [{
    "authID": "689267890026a49a66ea",
    "$id": "6898967400037298f9bb",
    "$createdAt": "2025-08-10T12:54:12.130+00:00",
    "$updatedAt": "2025-08-31T12:24:12.927+00:00",
    "$permissions": [
      "read(\"user:689267890026a49a66ea\")",
      "update(\"user:689267890026a49a66ea\")"
    ],
    "scanners": [
      {
        "scannerID": "P000000002",
        "$id": "68989785001ddfe0bac8",
        "$sequence": 1,
        "$createdAt": "2025-08-10T12:58:45.546+00:00",
        "$updatedAt": "2025-08-31T13:37:57.667+00:00",
        "$permissions": [],
        "samples": [
          {
            "modelResult": 2,
            "timestamp": "2025-08-01T12:12:12.121+00:00",
            "measurementIds": [
              5330707,
              5330706
            ],
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1",
            "$id": "68989a6f0010bcd4fb61",
            "$sequence": 3,
            "$createdAt": "2025-08-10T13:11:11.337+00:00",
            "$updatedAt": "2025-08-10T14:13:21.827+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "scanners"
      },
      {
        "scannerID": "P000000001",
        "$id": "6898981b002645e7a878",
        "$sequence": 2,
        "$createdAt": "2025-08-10T13:01:15.688+00:00",
        "$updatedAt": "2025-08-31T13:37:45.034+00:00",
        "$permissions": [],
        "samples": [
          {
            "modelResult": 0.2,
            "timestamp": "2025-08-09T12:12:12.121+00:00",
            "measurementIds": [
              5330711,
              5330712
            ],
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3",
            "$id": "68989a0c002e5cd52eae",
            "$sequence": 1,
            "$createdAt": "2025-08-10T13:09:32.824+00:00",
            "$updatedAt": "2025-08-10T14:16:52.230+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          },
          {
            "modelResult": 1.12,
            "timestamp": "2025-08-04T12:12:12.121+00:00",
            "measurementIds": [
              5330708,
              5330709,
              5330710
            ],
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2",
            "$id": "68989a3e0006d97d6e68",
            "$sequence": 2,
            "$createdAt": "2025-08-10T13:10:22.178+00:00",
            "$updatedAt": "2025-08-10T14:12:05.784+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          },
          {
            "modelResult": 6,
            "timestamp": "2025-08-10T02:02:02.020+00:00",
            "measurementIds": [],
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx5",
            "$id": "6898b392000f89319c13",
            "$sequence": 5,
            "$createdAt": "2025-08-10T14:58:26.326+00:00",
            "$updatedAt": "2025-08-10T14:58:26.326+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "scanners"
      },
      {
        "scannerID": "P000000004",
        "$id": "6898b2e2001c58ff00ba",
        "$sequence": 4,
        "$createdAt": "2025-08-10T14:55:30.515+00:00",
        "$updatedAt": "2025-08-31T13:36:40.618+00:00",
        "$permissions": [],
        "samples": [],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "scanners"
      }
    ],
    "fields": [
      {
        "fieldID": 1754834624331,
        "name": "Test Field 1",
        "$id": "6898a6ca0003dd396a6c",
        "$sequence": 1,
        "$createdAt": "2025-08-10T14:03:54.139+00:00",
        "$updatedAt": "2025-08-31T12:30:49.997+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "plants": [
          {
            "$id": "6898a6b800029d11d1dc",
            "$sequence": 3,
            "$createdAt": "2025-08-10T14:03:36.103+00:00",
            "$updatedAt": "2025-08-31T12:28:48.207+00:00",
            "$permissions": [
              "read(\"user:689267890026a49a66ea\")",
              "update(\"user:689267890026a49a66ea\")",
              "delete(\"user:689267890026a49a66ea\")"
            ],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "plants"
          },
          {
            "$id": "6898a6a50006f7b1eb40",
            "$sequence": 2,
            "$createdAt": "2025-08-10T14:03:17.182+00:00",
            "$updatedAt": "2025-08-31T12:29:00.141+00:00",
            "$permissions": [
              "read(\"user:689267890026a49a66ea\")",
              "update(\"user:689267890026a49a66ea\")",
              "delete(\"user:689267890026a49a66ea\")"
            ],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "plants"
          },
          {
            "$id": "6898a68b0006af48b4f5",
            "$sequence": 1,
            "$createdAt": "2025-08-10T14:02:51.209+00:00",
            "$updatedAt": "2025-08-31T12:29:13.072+00:00",
            "$permissions": [
              "read(\"user:689267890026a49a66ea\")",
              "update(\"user:689267890026a49a66ea\")",
              "delete(\"user:689267890026a49a66ea\")"
            ],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "plants"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "fields"
      },
      {
        "fieldID": 1754834636516,
        "name": "Test Sub-Field 1",
        "$id": "6898a6e0002a04037911",
        "$sequence": 2,
        "$createdAt": "2025-08-10T14:04:16.746+00:00",
        "$updatedAt": "2025-08-31T12:30:31.666+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "plants": [
          {
            "$id": "6898a6b800029d11d1dc",
            "$sequence": 3,
            "$createdAt": "2025-08-10T14:03:36.103+00:00",
            "$updatedAt": "2025-08-31T12:28:48.207+00:00",
            "$permissions": [
              "read(\"user:689267890026a49a66ea\")",
              "update(\"user:689267890026a49a66ea\")",
              "delete(\"user:689267890026a49a66ea\")"
            ],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "plants"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "fields"
      },
      {
        "fieldID": 1754837959229,
        "name": "Field without Plants",
        "$id": "6898b3d300246978268e",
        "$sequence": 4,
        "$createdAt": "2025-08-10T14:59:31.651+00:00",
        "$updatedAt": "2025-08-31T12:30:18.146+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "plants": [],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "fields"
      }
    ],
    "plants": [
      {
        "plantID": 1754834552473,
        "name": "Test Plant 1",
        "$id": "6898a68b0006af48b4f5",
        "$sequence": 1,
        "$createdAt": "2025-08-10T14:02:51.209+00:00",
        "$updatedAt": "2025-08-31T12:29:13.072+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "samples": [
          {
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2",
            "$id": "68989a3e0006d97d6e68",
            "$sequence": 2,
            "$createdAt": "2025-08-10T13:10:22.178+00:00",
            "$updatedAt": "2025-08-10T14:12:05.784+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          },
          {
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3",
            "$id": "68989a0c002e5cd52eae",
            "$sequence": 1,
            "$createdAt": "2025-08-10T13:09:32.824+00:00",
            "$updatedAt": "2025-08-10T14:16:52.230+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "plants"
      },
      {
        "plantID": 1754834584873,
        "name": "Test Plant 2",
        "$id": "6898a6a50006f7b1eb40",
        "$sequence": 2,
        "$createdAt": "2025-08-10T14:03:17.182+00:00",
        "$updatedAt": "2025-08-31T12:29:00.141+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "samples": [
          {
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3",
            "$id": "68989a0c002e5cd52eae",
            "$sequence": 1,
            "$createdAt": "2025-08-10T13:09:32.824+00:00",
            "$updatedAt": "2025-08-10T14:16:52.230+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "plants"
      },
      {
        "plantID": 1754834606198,
        "name": "Test Plant 3",
        "$id": "6898a6b800029d11d1dc",
        "$sequence": 3,
        "$createdAt": "2025-08-10T14:03:36.103+00:00",
        "$updatedAt": "2025-08-31T12:28:48.207+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "samples": [
          {
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1",
            "$id": "68989a6f0010bcd4fb61",
            "$sequence": 3,
            "$createdAt": "2025-08-10T13:11:11.337+00:00",
            "$updatedAt": "2025-08-10T14:13:21.827+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "plants"
      },
      {
        "plantID": 1754837991652,
        "name": "Plant without Field",
        "$id": "6898b406003aa9ade5fd",
        "$sequence": 5,
        "$createdAt": "2025-08-10T15:00:23.028+00:00",
        "$updatedAt": "2025-08-31T12:27:55.208+00:00",
        "$permissions": [
          "read(\"user:689267890026a49a66ea\")",
          "update(\"user:689267890026a49a66ea\")",
          "delete(\"user:689267890026a49a66ea\")"
        ],
        "samples": [
          {
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1",
            "$id": "68989a6f0010bcd4fb61",
            "$sequence": 3,
            "$createdAt": "2025-08-10T13:11:11.337+00:00",
            "$updatedAt": "2025-08-10T14:13:21.827+00:00",
            "$permissions": [],
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "plants"
      }
    ],
    "$sequence": 0
  }]
};

const newScannerDataStub = {
  'P000000003': {
    "total": 1,
    "documents": [
      {
        "scannerID": "P000000003",
        "$id": "6898a72b00255c7b5d7d",
        "$sequence": 3,
        "$createdAt": "2025-08-10T14:05:31.671+00:00",
        "$updatedAt": "2025-08-31T13:37:20.157+00:00",
        "$permissions": [],
        "samples": [
          {
            "modelResult": 100,
            "timestamp": "2025-08-10T01:01:01.001+00:00",
            "measurementIds": [],
            "sampleID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx4",
            "$id": "6898a76b0021b6ef0918",
            "$sequence": 4,
            "$createdAt": "2025-08-10T14:06:35.644+00:00",
            "$updatedAt": "2025-08-10T14:11:29.358+00:00",
            "$permissions": [],
            "68b43d27002884ee47f2": "6898a72b00255c7b5d7d",
            "$databaseId": "689261e7001977746c1f",
            "$collectionId": "samples"
          }
        ],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "scanners"
      }
    ]
  },
  'P000000004': {
    "total": 1,
    "documents": [
      {
        "scannerID": "P000000004",
        "$id": "6898b2e2001c58ff00ba",
        "$sequence": 4,
        "$createdAt": "2025-08-10T14:55:30.515+00:00",
        "$updatedAt": "2025-08-31T13:36:40.618+00:00",
        "$permissions": [],
        "samples": [],
        "$databaseId": "689261e7001977746c1f",
        "$collectionId": "scanners"
      }
    ]
  },
  'P000000005': {
    "total": 0,
    "documents": []
  }
};

const createScannerDataStub = {
  'P000000005': {
    "scannerID": "P000000005",
    "$id": "68e4067a002a9408102e",
    "$permissions": [
      "read(\"user:689e3b6f000c3e185d6f\")",
      "update(\"user:689e3b6f000c3e185d6f\")",
      "delete(\"user:689e3b6f000c3e185d6f\")"
    ],
    "$createdAt": "2025-10-06T18:12:10.788+00:00",
    "$updatedAt": "2025-10-06T18:12:10.788+00:00",
    "$sequence": 5,
    "samples": [],
    "$databaseId": "689261e7001977746c1f",
    "$collectionId": "scanners"
  }
};

const databaseService = {
  // // List documents
  // async listDocuments(colName, queries=[]) {
  //   try {
  //     const response = await asyncWithTimeout(database.listDocuments(config.dbId, config.collIds[colName], queries));
  //     return { data: response.documents || [], error: null };
  //   } catch (error) {
  //     console.error('Error fetching documents:', error.message);
  //     return { error: error.message };
  //   }
  // },
  // Update documents
  async updateDocument(collName, id, data) {
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      return { success: true, stubbed: true };
    } else {
      try {
        return await asyncWithTimeout(database.updateDocument(config.dbId, config.collIds[collName], id, data));
      } catch (error) {
        console.error('Error updating document:', error.message);
        return { error: error.message };
      }
    }
  },
  // Create Documents
  async createDocument(collName, data, authId=null, id = null) {
    try {
      // If permissions is not null it should be a user id. Use it to set permissions for the row
      let permissions = null;
      if (authId !== null) {
        permissions = [
          Permission.read(Role.user(authId)),    // Only this user can read
          Permission.update(Role.user(authId)),  // Only this user can update
          Permission.delete(Role.user(authId)),  // Only this user can delete
        ];
      }

      return await asyncWithTimeout(
        database.createDocument(
          config.dbId,
          config.collIds[collName],
          id || ID.unique(),
          data,
          permissions
        )
      );
    } catch (error) {
      console.error('Error creating document:', error.message);
      return { error: error.message };
    }
  },
  // // Delete Document
  // async deleteDocument(colName, id) {
  //   try {
  //     await asyncWithTimeout(database.deleteDocument(config.dbId, config.collIds[colName], id));
  //     return { success: true };
  //   } catch (error) {
  //     console.error('Error deleting document:', error.message);
  //     return { error: error.message };
  //   }
  // },

  // Get initial data from appwrite database
  async getInitData() {
    let initData;
    if (config.stub) {
      await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      initData = initDataStub[config.stub];
    } else {
      try {
        // Query for data. Must do tables with row security separately
        const [userWithScannersResponse, plantsResponse, fieldsResponse] = await Promise.all([
          asyncWithTimeout(database.listDocuments(
            config.dbId, 
            config.collIds['users'],
            [
              Query.select([
                'scanners.samples.*',
                // 'fields.plants.$id',
                // 'plants.samples.$id'
              ])
            ]
          )),
          asyncWithTimeout(database.listDocuments(
            config.dbId, 
            config.collIds['plants'],
            [
              Query.select([
                'samples.sampleID'
              ])
            ]
          )),
          asyncWithTimeout(database.listDocuments(
            config.dbId, 
            config.collIds['fields'],
            [
              Query.select([
                'plants.$id',
              ])
            ]
          ))
        ]);

        initData = {
          ...userWithScannersResponse.documents[0],
          plants: plantsResponse.documents,
          fields: fieldsResponse.documents
        };
      } catch (error) {
        console.error(error);
        initData = { error: error.message };
      }
    }

    return initData;
  },
  // Add scanner to user account and return the scanner data
  async addScannerToUserAccount(newScannerID, currentScanners, userId) {
    const userCollId = config.collIds['users'];
    const scannerCollId = config.collIds['scanners'];
    const scannerIDAttrId = 'scannerID';
    
    try {
      let scannerData;

      // Get the scanner data to ensure that it exists
      // Must occur before updating the relationship because we need the $id for the scanner
      if (config.stub) {
        await new Promise((res) => setTimeout(() => res(null), config.stubPause));
        scannerData = newScannerDataStub[newScannerID];
      } else {
        scannerData = await asyncWithTimeout(database.listDocuments(
            config.dbId,
            config.collIds[scannerCollId],
            [
              Query.equal(scannerIDAttrId, newScannerID)
            ]
          ),
          undefined,
          'An error occurred while trying to add this scanner. Please try again.'
        );
      }

      if (scannerData.total === 0) {
        // Create new scanner
        if (config.stub) {
          scannerData = createScannerDataStub[newScannerID];
        } else {
          scannerData = await asyncWithTimeout(database.createDocument(config.dbId, config.collIds[scannerCollId], ID.unique(), { scannerID: newScannerID }));
        }
      } else {
        // Extract the scanner data from the return
        scannerData = scannerData.documents[0];
      }

      if (config.stub === false) {
        // Add new scanner $id to the user's scanner relationship
        await asyncWithTimeout(database.updateDocument(config.dbId, config.collIds[userCollId], userId, { scanners: [ ...currentScanners, scannerData['$id']] }))
      }

      // Return the new scanner data
      return { data: scannerData, error: null };
    } catch (error) {
      console.error('Error adding scanner to user account:', error.message);
      return { error: error.message };
    }
  },
  // Remove scanner from user account
  async removeScannerFromUserAccount(scannerToRemoveID, currentScannerIDs, userId) {
    try {
      if (config.stub) {
        await new Promise((res) => setTimeout(() => res(null), config.stubPause));
      } else {
        // Remove target scanner from the users' scanner list
        const newScannersList = currentScannerIDs.filter(id => id !== scannerToRemoveID);

        // Update DB with the new scanner list
        await asyncWithTimeout(database.updateDocument(
            config.dbId,
            config.collIds['users'],
            userId,
            {
              scanners: newScannersList
            }
          ),
          undefined,
          'An error occurred while trying to remove this scanner. Please try again.'
        );
      }

      // True means successful
      return true;
    } catch (error) {
      // False means failure
      console.error('Error removing scanner from user account:', error.message);
      return false;
    }
  }
};

export default databaseService;
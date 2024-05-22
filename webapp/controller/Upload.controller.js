sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel"
], function(Controller, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("scheduleanu.controller.Upload", {
        handleFileSelection: function(oEvent) {
            var oFileUploader = oEvent.getSource();
            var oInput = oFileUploader.getDomRef().querySelector("input[type=file]");
            var oFile = oInput.files[0];
            
            if (oFile) {
                var oFileReader = new FileReader();
                
                oFileReader.onload = function(event) {
                    var sFileContent = event.target.result;
                    // Store the file content in a property of the controller
                    this._fileContent = sFileContent;
                    // MessageToast.show("File content: " + sFileContent);
                }.bind(this);
                
                oFileReader.readAsText(oFile);
            } else {
                MessageToast.show("No file selected.");
            }
        },
        
        handleUploadPress: function() {
            var oFileUploader = this.byId("fileUploader");
            if (!oFileUploader.getValue()) {
                MessageToast.show("Choose a file first");
                return;
            }
            
            // Check if file content is available
            if (this._fileContent) {
                // File content is available, display it
                MessageToast.show("File content: " + this._fileContent);
                console.log("this._fileContent-------", this._fileContent)
                console.log("type-----", typeof(this._fileContent))
                


                // Sample CSV data
                const csvData = this._fileContent;

                // Convert CSV to JSON function
                function csvToJson(csvData) {
                    const [headers, ...rows] = csvData.trim().split('\n').map(row => row.split(','));
                
                    return rows.map(row => {
                        return headers.reduce((obj, header, index) => {
                            // Handle specific revisions based on the header name
                            switch (header.trim()) {
                                case 'DelivDateCategory':
                                case 'SchedLineStscDeliveryDate':
                                case 'ScheduleLineDeliveryDate':
                                    obj[header.trim()] = row[index].trim();
                                    break;
                                default:
                                    obj[header.trim()] = row[index].trim();
                            }
                            return obj;
                        }, {});
                    });
                }

                // Convert CSV data to JSON
                const jsonData = csvToJson(csvData);
                
                console.log("jsonData-----", jsonData[0])
                console.log("jsonData-----", typeof(jsonData))

                var js = {
                    
                        "SchedulingAgreement": "5500000002",
                        "SchedulingAgreementItem": "10",
                        "ScheduleLine": "9",
                        "DelivDateCategory": "1",
                        "ScheduleLineDeliveryDate": "/Date(1714953600000)/",
                        "SchedLineStscDeliveryDate": "/Date(1714953600000)/",
                        "ScheduleLineDeliveryTime": "PT15H51M04S",
                        "OrderQuantityUnit": "M",
                        "ScheduleLineOrderQuantity": "1100",
                        "PurchaseRequisition": "",
                        "PurchaseRequisitionItem": "0",
                        "RoughGoodsReceiptQty": "0",
                         "NoOfRemindersOfScheduleLine": "0",
                        "PrevDelivQtyOfScheduleLine": "1100"
                      
                }
                console.log("js--------", js)
                var oModel = new ODataModel("/sap/opu/odata/sap/API_SCHED_AGRMT_PROCESS_SRV/");

                // Set the model to the view
                this.getView().setModel(oModel);
                // Read data from the service
                var rData = oModel.read("/A_SchAgrmtSchLine", {
                    success: function(oData) {
                        // Data read successfully
                        console.log("Data:", oData);
                    },
                    error: function(oError) {
                        // Error while reading data
                        console.error("Error:", oError);
                    }
                });
                console.log("rData---", rData)
                // const jsonData = JSON.parse(this._fileContent);

                
                //Create a new entity
                oModel.create("/A_SchAgrmtSchLine", jsonData[0], {
                    success: function(data) {
                        // Successfully created new entity
                        console.log("Data inserted successfully:", data);
                    },
                    error: function(error) {
                        // Error while creating entity
                        console.error("Error inserting data:", error);
                    }
                });

                
                var rData = oModel.read("/A_SchAgrmtSchLine", {
                    success: function(oData) {
                        // Data read successfully
                        console.log("Data:", oData);
                    },
                    error: function(oError) {
                        // Error while reading data
                        console.error("Error:", oError);
                    }
                });
                console.log("after rData---", rData)
                
            } else {
                // File content is not available, prompt the user to select a file first
                MessageToast.show("Please select a file first");
            }
        }
    });
});

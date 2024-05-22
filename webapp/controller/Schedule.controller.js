sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageBox, Fragment) {
    "use strict";

    return Controller.extend("scheduleanu.controller.Schedule", {
        onInit: function () {
            // Initialize the fragment
            this._oEditDialog = null;
        },

        onEditPress: function() {
            var table = this.byId("SchedulingAgreementDetail");
            var selectedItems = table.getSelectedItems();

            if (selectedItems.length === 0) {
                // Display message to user indicating that they need to select at least one item for editing
                MessageBox.error("Please select at least one item to edit.");
                return;
            }

            var selectedItem = selectedItems[0]; // Assuming single selection for simplicity
            var context = selectedItem.getBindingContext();
            var selectedData = context.getObject();

            // Create a JSON model to bind the selected data
            var oModel = new sap.ui.model.json.JSONModel(selectedData);
            this.getView().setModel(oModel, "editData");

            // Open the dialog
            if (!this._oEditDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "schedule.view.EditDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oEditDialog = oDialog;
                    this.getView().addDependent(this._oEditDialog);
                    this._oEditDialog.open();
                }.bind(this));
            } else {
                this._oEditDialog.open();
            }
        },

        onUploadPress: function() {
            this.getOwnerComponent().getRouter().navTo("RouteUpload");
        },

        onSavePress: function() {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oData = oView.getModel("editData").getData();
            var sPath = `/A_SchAgrmtSchLine(SchedulingAgreement='${oData.SchedulingAgreement}',SchedulingAgreementItem='${oData.SchedulingAgreementItem}',ScheduleLine='${oData.ScheduleLine}')`;

            // Add logic to update the data using the OData model
            oModel.update(sPath, oData, {
                success: function() {
                    MessageBox.success("Data updated successfully!");
                },
                error: function() {
                    MessageBox.error("Failed to update data.");
                }
            });

            this._oEditDialog.close();
        },

        onCancelPress: function() {
            this._oEditDialog.close();
        },

    });
});


        
        

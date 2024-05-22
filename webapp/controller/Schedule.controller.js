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
            this.getOwnerComponent().getRouter().navTo("Routeedit");
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


        
        
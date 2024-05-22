sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("scheduleanu.controller.Edit", {
        onInit: function () {
            this.getView().setModel(new JSONModel({
                filters: {
                    SchedulingAgreement: ""
                }
            }), "filters");
        },

        onSearch: function () {
            var sSchedulingAgreement = this.getView().getModel("filters").getProperty("/SchedulingAgreement");
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter([
                    new sap.ui.model.Filter("SchedulingAgreement", sap.ui.model.FilterOperator.EQ, sSchedulingAgreement)
                ]);
            }
        },
        onSave: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oTable = oView.byId("table");
            var aItems = oTable.getItems();
            var aData = [];
        
            // Loop through table items to capture changes
            aItems.forEach(function (oItem) {
                aData.push(oItem.getBindingContext().getObject());
            });
        
            // Assuming 'editData' model contains the edited data
            var oEditedData = oView.getModel("editData").getData();
        
            // Update each item's data in the backend
            aData.forEach(function (oItemData) {
                var sPath = `/A_SchAgrmtSchLine(SchedulingAgreement='${oItemData.SchedulingAgreement}',SchedulingAgreementItem='${oItemData.SchedulingAgreementItem}',ScheduleLine='${oItemData.ScheduleLine}')`;
                oModel.update(sPath, oEditedData, {
                    success: function () {
                        // Handle success
                        MessageToast.show("Data updated successfully!");
                    },
                    error: function () {
                        // Handle error
                        MessageToast.show("Failed to update data.");
                    }
                });
            });
        }
    });
});

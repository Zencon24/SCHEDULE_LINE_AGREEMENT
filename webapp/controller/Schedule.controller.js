sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Fragment, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("scheduleanu.controller.Schedule", {
        onInit: function () {
            // Initialize the fragment
            this._oEditDialog = null;
            
            // Initialize the filter model
            var oFilterModel = new JSONModel({
                SchedulingAgreement: "",
                SchedulingAgreementItem: "",
                ScheduleLine: ""
            });
            this.getView().setModel(oFilterModel, "filters");
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

        onPressSearch: function () {
            var oView = this.getView();
            var oTable = oView.byId("SchedulingAgreementDetail");
            var oFilterModel = oView.getModel("filters");
            var aFilters = [];

            var sSchedulingAgreement = oFilterModel.getProperty("/SchedulingAgreement");
            if (sSchedulingAgreement) {
                aFilters.push(new Filter("SchedulingAgreement", FilterOperator.Contains, sSchedulingAgreement));
            }

            var sSchedulingAgreementItem = oFilterModel.getProperty("/SchedulingAgreementItem");
            if (sSchedulingAgreementItem) {
                aFilters.push(new Filter("SchedulingAgreementItem", FilterOperator.Contains, sSchedulingAgreementItem));
            }

            var sScheduleLine = oFilterModel.getProperty("/ScheduleLine");
            if (sScheduleLine) {
                aFilters.push(new Filter("ScheduleLine", FilterOperator.Contains, sScheduleLine));
            }

            // Apply the filters to the table binding
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        }
    });
});

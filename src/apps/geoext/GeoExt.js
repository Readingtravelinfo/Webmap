/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/*
 * The code in this file is based on code taken from OpenLayers.
 *
 * Copyright (c) 2006-2007 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license.
 */
 
(function() {

    /**
     * Check to see if GeoExt.singleFile is true. It is true if the
     * GeoExt/SingleFile.js is included before this one, as it is
     * the case in single file builds.
     */
    var singleFile = (typeof GeoExt == "object" && GeoExt.singleFile);

    /**
     * The relative path of this script.
     */
    var scriptName = singleFile ? "GeoExt.js" : "lib/GeoExt.js";

    /**
     * Function returning the path of this script.
     */
    var getScriptLocation = function() {
        var scriptLocation = "";
        // If we load other scripts right before GeoExt using the same
        // mechanism to add script resources dynamically (e.g. OpenLayers), 
        // document.getElementsByTagName will not find the GeoExt script tag
        // in FF2. Using document.documentElement.getElementsByTagName instead
        // works around this issue.
        var scripts = document.documentElement.getElementsByTagName('script');
        for(var i=0, len=scripts.length; i<len; i++) {
            var src = scripts[i].getAttribute('src');
            if(src) {
                var index = src.lastIndexOf(scriptName); 
                // set path length for src up to a query string
                var pathLength = src.lastIndexOf('?');
                if(pathLength < 0) {
                    pathLength = src.length;
                }
                // is it found, at the end of the URL?
                if((index > -1) && (index + scriptName.length == pathLength)) {
                    scriptLocation = src.slice(0, pathLength - scriptName.length);
                    break;
                }
            }
        }
        return scriptLocation;
    };

    /**
     * If GeoExt.singleFile is false then the JavaScript files in the jsfiles
     * array are autoloaded.
     */
    if(!singleFile) {
        var jsfiles = new Array(
            "../../../apps/geoext/lib/GeoExt/data/AttributeReader.js",
            "../../../apps/geoext/lib/GeoExt/data/AttributeStore.js",
            "../../../apps/geoext/lib/GeoExt/data/FeatureRecord.js",
            "../../../apps/geoext/lib/GeoExt/data/FeatureReader.js",
            "../../../apps/geoext/lib/GeoExt/data/FeatureStore.js",
            "../../../apps/geoext/lib/GeoExt/data/LayerRecord.js",
            "../../../apps/geoext/lib/GeoExt/data/LayerReader.js",
            "../../../apps/geoext/lib/GeoExt/data/LayerStore.js",
            "../../../apps/geoext/lib/GeoExt/data/ScaleStore.js",
            "../../../apps/geoext/lib/GeoExt/data/StyleReader.js",
            "../../../apps/geoext/lib/GeoExt/data/WMSCapabilitiesReader.js",
            "../../../apps/geoext/lib/GeoExt/data/WMSCapabilitiesStore.js",
            "../../../apps/geoext/lib/GeoExt/data/WFSCapabilitiesReader.js",
            "../../../apps/geoext/lib/GeoExt/data/WFSCapabilitiesStore.js",
            "../../../apps/geoext/lib/GeoExt/data/WMSDescribeLayerReader.js",
            "../../../apps/geoext/lib/GeoExt/data/WMSDescribeLayerStore.js",
            "../../../apps/geoext/lib/GeoExt/data/WMCReader.js",
            "../../../apps/geoext/lib/GeoExt/widgets/Action.js",
            "../../../apps/geoext/lib/GeoExt/data/ProtocolProxy.js",
            "../../../apps/geoext/lib/GeoExt/widgets/FeatureRenderer.js",
            "../../../apps/geoext/lib/GeoExt/widgets/MapPanel.js",
            "../../../apps/geoext/lib/GeoExt/widgets/Popup.js",
            "../../../apps/geoext/lib/GeoExt/widgets/form.js",
            "../../../apps/geoext/lib/GeoExt/widgets/form/SearchAction.js",
            "../../../apps/geoext/lib/GeoExt/widgets/form/BasicForm.js",
            "../../../apps/geoext/lib/GeoExt/widgets/form/FormPanel.js",
            "../../../apps/geoext/lib/GeoExt/widgets/grid/SymbolizerColumn.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tips/SliderTip.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tips/LayerOpacitySliderTip.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tips/ZoomSliderTip.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/LayerNode.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/TreeNodeUIEventMixin.js",
            "../../../apps/geoext/lib/GeoExt/plugins/TreeNodeComponent.js",
            "../../../apps/geoext/lib/GeoExt/plugins/TreeNodeRadioButton.js",
            "../../../apps/geoext/lib/GeoExt/plugins/TreeNodeActions.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/LayerLoader.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/LayerContainer.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/BaseLayerContainer.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/OverlayLayerContainer.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/LayerParamNode.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/LayerParamLoader.js",
            "../../../apps/geoext/lib/GeoExt/widgets/tree/WMSCapabilitiesLoader.js",
            "../../../apps/geoext/lib/GeoExt/widgets/LayerOpacitySlider.js",
            "../../../apps/geoext/lib/GeoExt/widgets/LayerLegend.js",
            "../../../apps/geoext/lib/GeoExt/widgets/LegendImage.js",
            "../../../apps/geoext/lib/GeoExt/widgets/UrlLegend.js",
            "../../../apps/geoext/lib/GeoExt/widgets/WMSLegend.js",
            "../../../apps/geoext/lib/GeoExt/widgets/VectorLegend.js",
            "../../../apps/geoext/lib/GeoExt/widgets/LegendPanel.js",
            "../../../apps/geoext/lib/GeoExt/widgets/ZoomSlider.js",
            "../../../apps/geoext/lib/GeoExt/widgets/grid/FeatureSelectionModel.js",
            "../../../apps/geoext/lib/GeoExt/data/PrintPage.js",
            "../../../apps/geoext/lib/GeoExt/data/PrintProvider.js",
            "../../../apps/geoext/lib/GeoExt/plugins/PrintPageField.js",
            "../../../apps/geoext/lib/GeoExt/plugins/PrintProviderField.js",
            "../../../apps/geoext/lib/GeoExt/plugins/PrintExtent.js",
            "../../../apps/geoext/lib/GeoExt/plugins/AttributeForm.js",
            "../../../apps/geoext/lib/GeoExt/widgets/PrintMapPanel.js",
            "../../../apps/geoext/lib/GeoExt/state/PermalinkProvider.js",
            "../../../apps/geoext/lib/GeoExt/Lang.js"
        );

        var len = jsfiles.length;
        var allScriptTags = new Array(len);
        var host = getScriptLocation() + "lib/";    
        for (var i=0; i<len; i++) {
            allScriptTags[i] = "<script src='" + host + jsfiles[i] +"'></script>"; 
        }
        document.write(allScriptTags.join(""));
    }
})();

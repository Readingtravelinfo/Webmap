<?xml version='1.0' encoding='ISO-8859-1'?>
<StyledLayerDescriptor version='1.0.0'
    xsi:schemaLocation='http://www.opengis.net/sld StyledLayerDescriptor.xsd'
    xmlns = 'http://www.opengis.net/sld'
    xmlns:ogc = 'http://www.opengis.net/ogc'
    xmlns:xlink = 'http://www.w3.org/1999/xlink'
    xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>
<NamedLayer>
 <Name>Broadband Upgrades Style</Name>
 <UserStyle>
 <Title>Automatically Generated SLD</Title>
  <FeatureTypeStyle>
  <Rule>
   <Name>Upgrade Order</Name>
   <Title>Upgrade Order</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Order</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#FF4040</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#FF4040</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>28</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Upgrade Order Complete</Name>
   <Title>Upgrade Order Complete</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Order</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#660000</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#660000</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>28</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Upgrade Survey</Name>
   <Title>Upgrade Survey</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Survey</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#FFA573</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#FFA573</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>24</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Upgrade Survey Complete</Name>
   <Title>Upgrade Survey Complete</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Survey</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#FFAA00</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#FFAA00</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>24</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Install PSTN</Name>
   <Title>Install PSTN</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband PSTN Install</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#95EE6B</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#95EE6B</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>20</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Install PSTN Complete</Name>
   <Title>Install PSTN Complete</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband PSTN Install</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#2F8F00</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#2F8F00</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>20</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Install Broadband</Name>
   <Title>Install Broadband</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#9F3ED5</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#9F3ED5</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>16</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Install Broadband Complete</Name>
   <Title>Install Broadband Complete</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#48036F</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#48036F</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>16</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Install Westamo Router</Name>
   <Title>Install Westamo Router</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Install Westamo</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Configuration</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#6C8CD5</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#6C8CD5</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>12</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Configure Westamo Router</Name>
   <Title>Configure Westamo Router</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Install Westamo</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Configuration</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#1240AB</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#1240AB</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>12</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Westamo Router Installed</Name>
   <Title>Westamo Router Installed</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Install Westamo</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#000f7c</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#000f7c</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>12</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Install Gemini Unit</Name>
   <Title>Install Gemini Unit</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Install Gemini</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Configuration</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#cccccc</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#cccccc</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>8</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Configure Gemini Unit</Name>
   <Title>Configure Gemini Unit</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Install Gemini</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Configuration</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#C0C0C0</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#C0C0C0</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>8</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Gemini Unit Installed</Name>
   <Title>Gemini Unit Installed</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Install Gemini</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#868686</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#868686</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>8</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Cease Private Wire</Name>
   <Title>Cease Private Wire</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Cease Private Wire</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsNotEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsNotEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#F66F89</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#F66F89</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>4</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  <Rule>
   <Name>Cease Private Wire Complete</Name>
   <Title>Cease Private Wire Complete</Title>
   <ogc:Filter>
     <ogc:And>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>icon</ogc:PropertyName>
        <ogc:Literal>Broadband Cease Private Wire</ogc:Literal>
      </ogc:PropertyIsEqualTo>
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>worksstatus</ogc:PropertyName>
        <ogc:Literal>Complete</ogc:Literal>
      </ogc:PropertyIsEqualTo>
     </ogc:And>
   </ogc:Filter>
    <PointSymbolizer>
      <Graphic>
        <Mark>
          <WellKnownName>Circle</WellKnownName>
          <Fill>
            <CssParameter name='fill'>#F63E62</CssParameter>
          </Fill>
          <Stroke>
          <CssParameter name='stroke'>#F63E62</CssParameter>
          <CssParameter name='stroke-width'>1</CssParameter>
          </Stroke>
        </Mark>
        <Size>4</Size>
      </Graphic>
    </PointSymbolizer>
  </Rule>
  </FeatureTypeStyle>
 </UserStyle>
</NamedLayer>
</StyledLayerDescriptor>
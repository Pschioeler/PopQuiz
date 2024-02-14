<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format">
  <xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <!-- Root template -->
  <xsl:template match="/">
    <fo:root>
      <fo:layout-master-set>
        <!-- Define layout for the page -->
        <fo:simple-page-master master-name="page" page-height="11in" page-width="8.5in"
                               margin-top="1cm" margin-bottom="1cm" margin-left="1cm" margin-right="1cm">
          <fo:region-body/>
        </fo:simple-page-master>
      </fo:layout-master-set>
      
      <!-- Define content -->
      <fo:page-sequence master-reference="page">
        <fo:flow flow-name="xsl-region-body">
          <!-- Your content here -->
          <fo:block font-size="12pt">Hello, World!</fo:block>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
</xsl:stylesheet>

<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format">

  <!-- Match skabelse for root-elementet -->
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
          <!-- Itererer gennem alle svarobjekter -->
          <xsl:for-each select="answers/answer">
            <!-- Udskriv spørgsmål -->
            <fo:block font-size="12pt">
              <xsl:value-of select="question"/>
            </fo:block>
            <!-- Tilføj linjeskift efter spørgsmål -->
            <xsl:text>&#xA;</xsl:text>
            <!-- Udskriv svarmuligheder -->
            <xsl:for-each select="answerOptions/option">
            <!-- Tilføj linjeskift før hvert option-tag, undtagen det første -->
            <xsl:if test="position() > 1">
              <xsl:text>&#xA;</xsl:text>
            </xsl:if>
              <fo:block>
                <xsl:value-of select="."/>
              </fo:block>
            </xsl:for-each>
            <!-- Tilføj linjeskift efter svarmuligheder-->
            <xsl:text>&#xA;</xsl:text>
            <!-- Udskriv korrekte svar -->
            <fo:block>
              <xsl:value-of select="correctAnswers"/>
            </fo:block>
            <!-- Tilføj linjeskift efter korrekte svar -->
            <xsl:text>&#xA;</xsl:text>
            <!-- Udskriv brugerens svar -->
            <fo:block>
              <xsl:value-of select="usersAnswers"/>
            </fo:block>
            <!-- Tilføj linjeskift efter brugerens svar -->
            <xsl:text>&#xA;</xsl:text>
            <!-- Tilføj linjeskift efter hvert sæt af spørgsmål og svar -->
            <xsl:text>&#xA;</xsl:text>
          </xsl:for-each>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
</xsl:stylesheet>

<GameFile>
  <PropertyGroup Name="GuiGameControl" Type="Scene" ID="1c618004-be3b-46b5-8cf9-2f34a1d0e220" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" Tag="15" ctype="GameNodeObjectData">
        <Size X="1920.0000" Y="1080.0000" />
        <Children>
          <AbstractNodeData Name="pbHp" ActionTag="1932422603" Tag="16" IconVisible="False" HorizontalEdge="LeftEdge" VerticalEdge="TopEdge" LeftMargin="124.4621" RightMargin="1295.5378" TopMargin="20.3932" BottomMargin="1019.6068" ProgressInfo="100" ctype="LoadingBarObjectData">
            <Size X="500.0000" Y="40.0000" />
            <Children>
              <AbstractNodeData Name="lbHp" ActionTag="1374745689" Tag="52" IconVisible="False" LeftMargin="-3.2214" RightMargin="3.2214" TopMargin="7.8659" BottomMargin="6.1341" IsCustomSize="True" FontSize="20" LabelText="1/10000" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="500.0000" Y="26.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="246.7786" Y="19.1341" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.4936" Y="0.4784" />
                <PreSize X="1.0000" Y="0.6500" />
                <FontResource Type="Normal" Path="fonts/bold.ttf" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="374.4621" Y="1039.6068" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.1950" Y="0.9626" />
            <PreSize X="0.2604" Y="0.0370" />
            <ImageFileData Type="Default" Path="Default/LoadingBarFile.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="Text_1" ActionTag="77415118" Tag="17" IconVisible="False" LeftMargin="17.9929" RightMargin="1820.0071" TopMargin="19.7356" BottomMargin="1021.2644" FontSize="30" LabelText="HP:" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="82.0000" Y="39.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="58.9929" Y="1040.7644" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.0307" Y="0.9637" />
            <PreSize X="0.0427" Y="0.0361" />
            <FontResource Type="Normal" Path="fonts/bold.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lbNotification" ActionTag="-1164654100" Tag="6" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="210.0000" RightMargin="210.0000" TopMargin="178.8022" BottomMargin="751.1978" IsCustomSize="True" FontSize="30" LabelText="Player a was killed by player b" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="1500.0000" Y="150.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="960.0000" Y="826.1978" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.7650" />
            <PreSize X="0.7813" Y="0.1389" />
            <FontResource Type="Normal" Path="fonts/bold.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="minimap" ActionTag="1997240762" Tag="56" IconVisible="False" HorizontalEdge="RightEdge" VerticalEdge="TopEdge" LeftMargin="1095.0000" RightMargin="5.0000" TopMargin="5.0000" BottomMargin="255.0000" TouchEnable="True" ClipAble="False" ComboBoxIndex="1" ColorAngle="90.0000" ctype="PanelObjectData">
            <Size X="820.0000" Y="820.0000" />
            <Children>
              <AbstractNodeData Name="sprMinimap" ActionTag="-899870694" Tag="55" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="10.0000" RightMargin="10.0000" TopMargin="10.0000" BottomMargin="10.0000" ctype="SpriteObjectData">
                <Size X="800.0000" Y="800.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="410.0000" Y="410.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.5000" />
                <PreSize X="0.9756" Y="0.9756" />
                <FileData Type="Normal" Path="map/minimap/map0.png" Plist="" />
                <BlendFunc Src="1" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="1.0000" ScaleY="1.0000" />
            <Position X="1915.0000" Y="1075.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.9974" Y="0.9954" />
            <PreSize X="0.4271" Y="0.7593" />
            <SingleColor A="255" R="107" G="107" B="120" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>
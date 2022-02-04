<GameFile>
  <PropertyGroup Name="GuiRoomInfo" Type="Scene" ID="31d416e1-983a-4e5d-b6bf-c1436d5623c2" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Scene" Tag="20" ctype="GameNodeObjectData">
        <Size X="1920.0000" Y="1080.0000" />
        <Children>
          <AbstractNodeData Name="background_1" ActionTag="-502764456" Tag="363" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="0.0002" RightMargin="-0.0002" ctype="SpriteObjectData">
            <Size X="1920.0000" Y="1080.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="960.0002" Y="540.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="common/background.jpg" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="sprLoading" ActionTag="-1617562261" Tag="12" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="896.0000" RightMargin="896.0000" TopMargin="476.0000" BottomMargin="476.0000" ctype="SpriteObjectData">
            <Size X="128.0000" Y="128.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="960.0000" Y="540.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.0667" Y="0.1185" />
            <FileData Type="Normal" Path="common/reload.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Text_1" ActionTag="-1226104278" Tag="13" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="460.0000" RightMargin="460.0000" TopMargin="608.9080" BottomMargin="371.0920" IsCustomSize="True" FontSize="50" LabelText="Waiting for other players..." HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="1000.0000" Y="100.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="960.0000" Y="421.0920" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.3899" />
            <PreSize X="0.5208" Y="0.0926" />
            <FontResource Type="Normal" Path="fonts/arialbd.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lbRoomId" ActionTag="-1326157977" Tag="27" IconVisible="False" HorizontalEdge="LeftEdge" LeftMargin="25.7430" RightMargin="894.2571" TopMargin="26.4343" BottomMargin="1001.5657" IsCustomSize="True" FontSize="30" LabelText="Room ID : " ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="1000.0000" Y="52.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="525.7430" Y="1027.5657" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2738" Y="0.9514" />
            <PreSize X="0.5208" Y="0.0481" />
            <FontResource Type="Normal" Path="fonts/arialbd.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lbNumPlayer" ActionTag="776845619" Tag="11" IconVisible="False" HorizontalEdge="LeftEdge" LeftMargin="25.7430" RightMargin="894.2571" TopMargin="135.7620" BottomMargin="892.2380" IsCustomSize="True" FontSize="30" LabelText="Players   : 0" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="1000.0000" Y="52.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="525.7430" Y="918.2380" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2738" Y="0.8502" />
            <PreSize X="0.5208" Y="0.0481" />
            <FontResource Type="Normal" Path="fonts/arialbd.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="btnCancel" ActionTag="-145021712" Tag="48" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="710.0000" RightMargin="710.0000" TopMargin="828.4700" BottomMargin="151.5300" TouchEnable="True" FontSize="40" ButtonText="Cancel" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="70" Scale9Height="78" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
            <Size X="500.0000" Y="100.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="960.0000" Y="201.5300" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.1866" />
            <PreSize X="0.2604" Y="0.0926" />
            <FontResource Type="Normal" Path="fonts/arialbd.ttf" Plist="" />
            <TextColor A="255" R="255" G="255" B="255" />
            <DisabledFileData Type="Default" Path="Default/Button_Disable.png" Plist="" />
            <PressedFileData Type="Normal" Path="common/btn_back.png" Plist="" />
            <NormalFileData Type="Normal" Path="common/btn_back.png" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
          <AbstractNodeData Name="lbRoomName" ActionTag="1075795968" Tag="364" IconVisible="False" HorizontalEdge="LeftEdge" LeftMargin="25.7430" RightMargin="894.2571" TopMargin="81.0981" BottomMargin="946.9019" IsCustomSize="True" FontSize="30" LabelText="Room     : " ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
            <Size X="1000.0000" Y="52.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="525.7430" Y="972.9019" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2738" Y="0.9008" />
            <PreSize X="0.5208" Y="0.0481" />
            <FontResource Type="Normal" Path="fonts/arialbd.ttf" Plist="" />
            <OutlineColor A="255" R="255" G="0" B="0" />
            <ShadowColor A="255" R="110" G="110" B="110" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>
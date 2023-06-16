import QtQuick
import QtQuick.Layouts
import QtQuick.Controls 2.1

ColumnLayout{
    property alias text: loggingText.text
    spacing: 1
    Rectangle{
        color: "#C81000"
        Layout.fillWidth: true
        Layout.preferredHeight: 25
        Text{
            anchors.fill: parent
            font.bold: true
            font.pixelSize: parent.height - 10
            horizontalAlignment: Text.AlignHCenter
            text: "Output"
            color: "white"
        }
    }
    ScrollView {
        Layout.fillHeight: true
        Layout.fillWidth: true
        background: Rectangle { color: "white"}
        TextArea{
            id: loggingText
            Layout.fillWidth: true
            Layout.fillHeight: true
            color: "black"
        }
    }
}

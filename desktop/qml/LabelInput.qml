import QtQuick
import QtQuick.Layouts

RowLayout{
    id: root
    property alias label: labelText.text
    property alias text: fieldValue.text
    signal editingFinished()
    spacing: 1
    Rectangle{
        id: labelRec
        color: "lightgrey"
        Layout.preferredHeight: 27
        Layout.preferredWidth: 150
        Text{
            id: labelText
            text: "Label"
            verticalAlignment: Text.AlignVCenter
            font.bold: true
            anchors.leftMargin: 10
            anchors.fill: parent
            anchors.margins: 2
            font.pixelSize: height - 10
        }
    }
    Rectangle{
        color: "white"
        Layout.preferredHeight: 27
        Layout.fillWidth: true
        FieldInput{
            id: fieldValue
            anchors.fill: parent
            anchors.margins: 1
            anchors.leftMargin: 3
            onEditingFinished: root.editingFinished();
        }
    }
}
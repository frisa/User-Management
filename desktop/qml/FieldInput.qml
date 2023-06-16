import QtQuick
import QtQuick.Controls

Rectangle{
    id: root
    property alias text: textInput.text
    signal editingFinished()

    border.color: "black"
    color: "white"
    radius: 4; smooth: true
    TextField{
        id: textInput
        anchors.fill: parent
        anchors.margins: 2
        color: focus ? "black" : "gray"
        font.pixelSize: parent.height - 12
        onEditingFinished: root.editingFinished()
        background: Rectangle { color: "white"}
    }
}
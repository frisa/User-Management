import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ApplicationWindow {
    id: root
    minimumWidth: 800
    minimumHeight: 400
    visible: true
    title: "Client"
    RowLayout{
        anchors.fill: parent
        ColumnLayout{
            Layout.preferredWidth: 320
            Layout.maximumWidth: 320
            Layout.fillHeight: true
            AuthInput{
                    Layout.fillWidth: true
            }
            LoggingView{
                    Layout.fillWidth: true
                    text: authBackend.log
            }
        }
    }
}

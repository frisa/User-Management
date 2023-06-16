import QtQuick
import QtQuick.Layouts
import QtQuick.Controls 2.1

ColumnLayout{
    spacing: 1
    Rectangle{
        color: "#C81000"
        Layout.fillWidth: true
        Layout.preferredHeight: 25
        Text{
            text: "Login"
            color: "white"
            horizontalAlignment: Text.AlignHCenter
            font.bold: true
            anchors.fill: parent
        }
    }
    LabelInput{
        id: login
        label: "User Name"
        text: authBackend.getUserName()
        onEditingFinished: {
                    authBackend.setUserName(login.text);
                }
    }
    LabelInput{
        id: password
        label: "Password"
        text: authBackend.getPassword()
        onEditingFinished: {
                    authBackend.setPassword(password.text);
                }
    }
    LabelInput{
        id: server
        label: "Server Address"
        text: authBackend.getServer()
        onEditingFinished: {
                    authBackend.setServer(server.text);
                }
    }
    Button{
        text: "Login"
        Layout.fillWidth: true
        onClicked: {
            authBackend.authUser();
        }
    }
}
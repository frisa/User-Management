#ifndef AUTHBACKEND_H
#define AUTHBACKEND_H
#include <QObject>
#include <QString>
#include <qqml.h>

class AuthBackend: public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString userName READ getUserName WRITE setUserName NOTIFY changeUserNameNotify);
    Q_PROPERTY(QString password READ getPassword WRITE setPassword NOTIFY changePasswordNotify);
    Q_PROPERTY(QString server READ getServer WRITE setServer NOTIFY changeServerNotify);
    Q_PROPERTY(bool sslEnabled READ getSslEnabled WRITE setSslEnabled NOTIFY changeSslEnabledNotify);
    Q_PROPERTY(QString log READ getLog WRITE setLog NOTIFY changeLogNotify);
    QML_ELEMENT

public:
    explicit AuthBackend(QObject *parent = nullptr);
    Q_INVOKABLE QString getUserName() const;
    Q_INVOKABLE void setUserName(const QString &value);

    Q_INVOKABLE QString getPassword() const;
    Q_INVOKABLE void setPassword(const QString &value);

    Q_INVOKABLE QString getServer() const;
    Q_INVOKABLE void setServer(const QString &value);

    Q_INVOKABLE void setSslEnabled(bool value);
    Q_INVOKABLE bool getSslEnabled() const;

    Q_INVOKABLE QString getLog() const;
    Q_INVOKABLE void setLog(const QString &value);

    Q_INVOKABLE bool authUser();

signals:
    void changeUserNameNotify();
    void changePasswordNotify();
    void changeServerNotify();
    void changeSslEnabledNotify();
    void changeLogNotify();

private: 
    QString m_userName;
    QString m_password;
    bool m_sslEnabled;
    QString m_log;
    std::string m_svrAddr;
};

#endif
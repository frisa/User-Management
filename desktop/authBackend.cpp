#include <iostream>
#include <sstream>
#include <memory>
#include <fstream>
#include <string>
#include <grpcpp/grpcpp.h>
#include <filesystem>

#include "authBackend.h"
#include "auth.grpc.pb.h"

class TestClient
{
public:
    TestClient(std::shared_ptr<grpc::Channel> channel)
        : stub_(auth::Authenticator::NewStub(channel))
    {
    }

    bool TestAuthentication(const std::string &user, const std::string &password)
    {
        auth::AuthRequest request;
        request.set_user(user);
        request.set_password(password);

        auth::AuthReply response;
        grpc::ClientContext context;

        grpc::Status status = stub_->Authenticate(&context, request, &response);
        if (status.ok())
        {
            return response.authenticated();
        }
        else
        {
            std::cout << status.error_code() << ": " << status.error_message() << std::endl;
            return false;
        }
    }

private:
    std::unique_ptr<auth::Authenticator::Stub> stub_;
};

AuthBackend::AuthBackend(QObject *parent)
    : QObject(parent)
{
    m_userName = "Admin";
    m_password = "123456789";
    m_sslEnabled = false;
    setLog("Test application started");
    m_svrAddr = "localhost:50051";
}

QString AuthBackend::getUserName() const
{
    return m_userName;
}

QString AuthBackend::getPassword() const
{
    return m_password;
}

QString AuthBackend::getServer() const
{
    return QString::fromStdString(m_svrAddr);
}

void AuthBackend::setUserName(const QString &userName)
{
    if (userName == m_userName)
    {
        return;
    }
    m_userName = userName;
    emit changeUserNameNotify();
}

void AuthBackend::setPassword(const QString &password)
{
    if (password == m_password)
    {
        return;
    }
    m_password = password;
    emit changePasswordNotify();
}

void AuthBackend::setServer(const QString &serverAddr)
{
    if (serverAddr.toStdString() == m_svrAddr)
    {
        return;
    }
    m_svrAddr = serverAddr.toStdString();
    emit changeServerNotify();
}

bool AuthBackend::authUser()
{
    std::string userName = m_userName.toStdString();
    std::string password = m_password.toStdString();

    setLog("Request Authentication [svr: " + QString::fromStdString(m_svrAddr) + "]: " + m_userName);
    std::shared_ptr<grpc::Channel> chnl;
    std::shared_ptr<grpc::ChannelCredentials> chlCred;
    chlCred = grpc::InsecureChannelCredentials();
    chnl = grpc::CreateChannel(m_svrAddr, chlCred);
    TestClient tstClient(chnl);
    bool reply = tstClient.TestAuthentication(userName, password);
    QString rep = "Deny";
    if (reply)
    {
        rep = "Allow";
    }
    setLog("Response: [" + rep + "]");
    return true;
}

void AuthBackend::setSslEnabled(bool value)
{
    m_sslEnabled = value;
    emit changeSslEnabledNotify();
}

bool AuthBackend::getSslEnabled() const
{
    return m_sslEnabled;
}

void AuthBackend::setLog(const QString &value)
{
    m_log.append(value);
    m_log.append("\n");
    emit changeLogNotify();
}

QString AuthBackend::getLog() const
{
    return m_log;
}
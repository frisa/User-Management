#include <iostream>
#include <sstream>
#include <memory>
#include <fstream>
#include <string>
#include <grpcpp/grpcpp.h>
#include <filesystem>

#include "authBackend.h"
#include "authServer.grpc.pb.h"

namespace{
    void printAuthentication(std::string user, std::string password, bool sslEnabled)
    {
        std::cout << "[User: " << user << ", Password: " << password << ", SSL: " << sslEnabled << "]" << std::endl;
    }
    
    namespace fs = std::filesystem;
    std::string read_keycert(const std::string filename)
    {
        std::cout << "Current: " << fs::current_path() << std::endl;
        std::ifstream caFile(filename, std::ios::binary);
        if (caFile.is_open())
        {
            std::stringstream buffer;
            std::cout << "Loading SSL from: " << filename << std::endl;
            buffer << caFile.rdbuf();
            return buffer.str();
        }
        else
        {
            std::cout << "File: " << filename << " cannot be open" << std::endl;
            return std::string();
        }
    }
}

class TestClient 
{
 public:
  TestClient(std::shared_ptr<grpc::Channel> channel)
      : stub_(authservice::Authorizer::NewStub(channel)) {}

  bool TestAuthentication(const std::string& user, const std::string& password) 
  {
    authservice::AuthRequest request;
    request.set_login(user);
    request.set_password(password);

    authservice::AuthReply response;
    grpc::ClientContext context;

    grpc::Status status = stub_->Authorize(&context, request, &response);
    if (status.ok()) 
    {
        return response.authorized();
    } 
    else 
    {
      std::cout << status.error_code() << ": " << status.error_message() << std::endl;
      return false;
    }
  }

 private:
    std::unique_ptr<authservice::Authorizer::Stub> stub_;
};

AuthBackend::AuthBackend(QObject *parent):
QObject(parent)
{
    m_userName = "Admin";
    m_password = "1234567890";
    m_sslEnabled = false;
    setLog("Test application started");
    m_svrAddr = "localhost:7000";
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
    if(userName == m_userName)
    {
        return;
    }
    m_userName =  userName;
    emit changeUserNameNotify();
}

void AuthBackend::setPassword(const QString &password)
{
    if(password == m_password)
    {
        return;
    }
    m_password = password;
    emit changePasswordNotify();
}

void AuthBackend::setServer(const QString &serverAddr)
{
    if(serverAddr.toStdString() == m_svrAddr)
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

    printAuthentication(userName, password, m_sslEnabled);
    
    setLog("Request Authentication [svr: " + QString::fromStdString(m_svrAddr) + "]: " + m_userName);
    std::shared_ptr<grpc::Channel> chnl;
    std::shared_ptr<grpc::ChannelCredentials> chlCred;

    if (m_sslEnabled)
    {
        std::string pathCertFile = "/tmp/ca.pem";
        std::string caCert = read_keycert(pathCertFile);
        grpc::SslCredentialsOptions sslOpts;
        sslOpts.pem_root_certs = caCert;
        chlCred = grpc::SslCredentials(sslOpts);
    }
    else
    {
        chlCred = grpc::InsecureChannelCredentials();
    }
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
    //static int index = 0;
    //QString timeStamp = QString("%1").arg(++index, 8, 16, QChar('0'));
    
    //m_log.append('[' + timeStamp + ']');
    m_log.append(value);
    m_log.append("\n");
    emit changeLogNotify();
}

QString AuthBackend::getLog() const
{
    return m_log;
}
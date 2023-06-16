#include <QQmlContext>
#include <QApplication>
#include <QQmlApplicationEngine>
#include <iostream>
#include "authBackend.h"

int main(int argc, char **argv)
{
    std::cout << "Authentication client starting 2" << std::endl;
    QApplication app(argc, argv);
    QQmlApplicationEngine engine;
    
    AuthBackend *authBackend = new AuthBackend(&app);

    QQmlContext* context = engine.rootContext();
    context->setContextProperty("authBackend", authBackend);
    const QUrl url(u"qrc:qt/qml/ui/MainWindowUi/Application.qml"_qs);
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated, &app, [url](QObject *obj, const QUrl &objUrl){
      if (!obj && url == objUrl)
      {
        QCoreApplication::exit(-1);
      }
      }, Qt::QueuedConnection);
    engine.load(url);
    return app.exec();
}
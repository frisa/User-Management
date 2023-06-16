cmake_minimum_required(VERSION 3.0.0)
project(SimUI VERSION 0.1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_PREFIX_PATH "/home/jan/Qt/6.5.0/gcc_64")
set(MY_CMAKE_COMMON_FILE "/home/jan/Repositories/grpc/examples/cpp/cmake/common.cmake")

#gRPC specific
include(${MY_CMAKE_COMMON_FILE})

# Prepare directory for proto genereated files
set(auth_generated_files "${CMAKE_CURRENT_LIST_DIR}/gen")

# Proto file
get_filename_component(auth_proto "../server/auth.proto" ABSOLUTE)
get_filename_component(auth_proto_path "${auth_proto}" PATH)

# Generated sources
set(auth_proto_srcs "${auth_generated_files}/auth.pb.cc")
set(auth_proto_hdrs "${auth_generated_files}/auth.pb.h")
set(auth_grpc_srcs "${auth_generated_files}/auth.grpc.pb.cc")
set(auth_grpc_hdrs "${auth_generated_files}/auth.grpc.pb.h")

add_custom_command(
      OUTPUT "${auth_proto_srcs}" "${auth_proto_hdrs}" "${auth_grpc_srcs}" "${auth_grpc_hdrs}"
      COMMAND ${_PROTOBUF_PROTOC}
      ARGS --grpc_out "${auth_generated_files}"
        --cpp_out "${auth_generated_files}"
        -I "${auth_proto_path}"
        --plugin=protoc-gen-grpc="${_GRPC_CPP_PLUGIN_EXECUTABLE}"
        "${auth_proto}"
      DEPENDS "${auth_proto}")

# Include generated *.pb.h files
include_directories("${auth_generated_files}")

# Link final gRPC library
add_library(auth_grpc_proto
  ${auth_grpc_srcs}
  ${auth_grpc_hdrs}
  ${auth_proto_srcs}
  ${auth_proto_hdrs})
target_link_libraries(auth_grpc_proto
  ${_REFLECTION}
  ${_GRPC_GRPCPP}
  ${_PROTOBUF_LIBPROTOBUF})


# Add source files to the final client application
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)
set(CLIENT_SOURCES ./simUi.cpp
./authBackend.h
./authBackend.cpp)

# Qt specific commands
find_package(Qt6 REQUIRED COMPONENTS Core)
# sudo apt install libgl1-mesa-dev
find_package(Qt6 REQUIRED COMPONENTS Gui)
find_package(Qt6 REQUIRED COMPONENTS Qml)
find_package(Qt6 REQUIRED COMPONENTS Widgets)

# setup the QT properties
set(QT_QML_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/qml)

qt_standard_project_setup()
qt_add_executable(SimUI ${CLIENT_SOURCES})
qt_add_resources(SimUI "images"
  PREFIX "/images"
  FILES
    images/satelite.png
)
# the qml files will be in prefix /qt/qml/
set_source_files_properties(qml/Application.qml PROPERTIES QT_RESOURCE_ALIAS Application.qml)
qt_add_qml_module(SimUI
  URI
    MainWindowUi
  RESOURCE_PREFIX /qt/qml/ui
  QML_FILES
    qml/Application.qml
    qml/AuthInput.qml
    qml/FieldInput.qml
    qml/LabelInput.qml
    qml/LoggingView.qml
)

target_link_libraries(SimUI PRIVATE
  auth_grpc_proto
  ${_REFLECTION}
  ${_GRPC_GRPCPP}
  ${_PROTOBUF_LIBPROTOBUF}
  Qt6::Core
  Qt6::Gui
  Qt6::Widgets
  Qt6::Qml)
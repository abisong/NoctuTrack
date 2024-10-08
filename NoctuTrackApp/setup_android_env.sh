#!/bin/bash

export ANDROID_HOME="/home/runner/Android/Sdk"
export ANDROID_SDK_ROOT="/home/runner/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools"

echo "ANDROID_HOME is set to: $ANDROID_HOME"
echo "ANDROID_SDK_ROOT is set to: $ANDROID_SDK_ROOT"
echo "PATH is set to: $PATH"

# Verify if Android SDK components are installed
if [ ! -d "$ANDROID_HOME" ]; then
    echo "Android SDK not found. Please install it using the system_dependency_install_tool."
    exit 1
fi

if [ ! -d "$ANDROID_HOME/platform-tools" ]; then
    echo "Android SDK Platform-tools not found. Installing..."
    yes | sdkmanager "platform-tools"
fi

if [ ! -d "$ANDROID_HOME/build-tools" ]; then
    echo "Android SDK Build-tools not found. Installing..."
    yes | sdkmanager "build-tools;30.0.3"
fi

if [ ! -d "$ANDROID_HOME/platforms/android-30" ]; then
    echo "Android SDK Platform 30 not found. Installing..."
    yes | sdkmanager "platforms;android-30"
fi

echo "Android SDK setup completed."

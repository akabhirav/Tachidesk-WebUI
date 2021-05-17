#!/bin/bash

# Copyright (C) Contributors to the Suwayomi project
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

echo "Downloading jre..."

jre="OpenJDK8U-jre_x64_windows_hotspot_8u292b10.zip"
curl -L "https://github.com/AdoptOpenJDK/openjdk8-binaries/releases/download/jdk8u292-b10/OpenJDK8U-jre_x64_windows_hotspot_8u292b10.zip" -o $jre

echo "creating windows bundle"

jar=$(ls ../server/build/Tachidesk-*.jar)
jar_name=$(echo $jar | cut -d'/' -f4)
release_name=$(echo $jar_name | cut -d'.' -f4 --complement)-win64

# make release dir
mkdir $release_name

unzip $jre

# move jre
mv jdk8u292-b10-jre $release_name/jre

cp $jar $release_name/Tachidesk.jar

cp resources/Tachidesk.bat $release_name
cp resources/Tachidesk-debug.bat $release_name

zip_name=$release_name.zip
zip -9 -r $zip_name $release_name

cp $zip_name ../server/build/

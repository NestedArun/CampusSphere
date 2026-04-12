@echo off
setlocal enabledelayedexpansion

echo === Building CampusSphere Java Services ===

set "SRC=src"
set "OUT=out"
set "MAIN=com.campussphere.gateway.ApiGateway"

if not exist "%OUT%" mkdir "%OUT%"

set "SOURCES="
for /R "%SRC%" %%f in (*.java) do (
  set "SOURCES=!SOURCES! \"%%f\""
)

echo Compiling: %SOURCES%

javac -d "%OUT%" %SOURCES%
if errorlevel 1 (
  echo Java compilation failed. Ensure a JDK is installed and on PATH.
  echo If you need Java 21 features, install JDK 21 or run the build from WSL/Git Bash with a compatible JDK.
  exit /b %errorlevel%
)

echo Creating JAR...
jar --create --file=campussphere-services.jar --main-class=%MAIN% -C "%OUT%" .

echo.
echo === Build complete: campussphere-services.jar ===
echo Run with: java -jar campussphere-services.jar

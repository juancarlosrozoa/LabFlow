@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET ___MVNW_OURCDIR__=%~dp0
@SET ___MVNW_JAVACMD__=java
@IF NOT "%JAVA_HOME%"=="" SET ___MVNW_JAVACMD__="%JAVA_HOME%\bin\java"

@SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.1/maven-wrapper-3.3.1.jar
@SET WRAPPER_JAR=%___MVNW_OURCDIR__.mvn\wrapper\maven-wrapper.jar

@IF NOT EXIST %WRAPPER_JAR% (
  @ECHO Downloading Maven Wrapper...
  @powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%WRAPPER_JAR%'}"
)

@%___MVNW_JAVACMD__% -classpath %WRAPPER_JAR% org.apache.maven.wrapper.MavenWrapperMain %*

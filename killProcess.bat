@echo off
title killBat
echo %~dp0
set batPath=%~dp0
set pname=%1.exe
echo pname: %pname%

TASKKILL /F /IM %pname%

echo over

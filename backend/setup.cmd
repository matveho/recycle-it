@ECHO OFF
TITLE Server Setup
ECHO Please wait...

".\python-3.11.9-embed-amd64\python.exe" get-pip.py
@REM ".\python-3.11.9-embed-amd64\python.exe" -m venv venv

echo python311.zip > ".\python-3.11.9-embed-amd64\python311._pth"
echo . >> ".\python-3.11.9-embed-amd64\python311._pth"
echo. >> ".\python-3.11.9-embed-amd64\python311._pth"
echo. >> ".\python-3.11.9-embed-amd64\python311._pth"
echo # Uncomment to run site.main() automatically  >> ".\python-3.11.9-embed-amd64\python311._pth"
echo import site >> ".\python-3.11.9-embed-amd64\python311._pth"

".\python-3.11.9-embed-amd64\python.exe" -m pip install virtualenv

".\python-3.11.9-embed-amd64\python.exe" -m virtualenv venv

@REM python -m venv venv

call .\venv\Scripts\activate.bat

pip install PyYAML==5.3.1

git clone https://github.com/tensorflow/models.git
cd models\research
"..\..\protoc-3.20.3-win64\bin\protoc.exe" .\object_detection\protos\*.proto --python_out=. 
cp .\object_detection\packages\tf2\setup.py .
python -m pip install .

@REM xcopy .\object_detection ..\.. /E /I

@REM pip install tf-models-official
cd ..\..
ECHO Installation...
pip install -r requirements.txt
:: # needed to install object_detection library and enlarge labels

@REM @REM ".\python-3.11.9-embed-amd64\python.exe" -m pip install docopt==0.6.1
@REM pip install PyYAML

@REM :: # install object_detection library
@REM :: cd models\research


PAUSE
python -m venv venv
.\venv\Scripts\activate.bat
pip install -r requirements.txt

@REM # needed to install object_detection library and enlarge labels
git clone https://github.com/tensorflow/models.git \
    @REM && sed -i "s#ImageFont.truetype('arial.ttf', 24)#ImageFont.truetype('arial.ttf', 50)#g" .\models\research\object_detection\utils\visualization_utils.py
    @REM && cp /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf /usr/share/fonts/truetype/dejavu/arial.ttf

@REM # install object_detection library
cd models\research \
    && protoc object_detection\protos\*.proto --python_out=. \
    && cp object_detection\packages\tf2\setup.py . && \
    python -m pip install .
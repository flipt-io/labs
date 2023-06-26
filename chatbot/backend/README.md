# Running `backend` with a Virtual Environment

Make sure to have python 3.9.x or higher installed.

## `python -m venv`

Run the above command within the backend directory to create the virtual environment.

The above command should have created a `venv` folder that will contain the necessary programs to activate your virtual environment as well as a place for installing `python` libs.

## `source venv/bin/activate`

Run the above command to activate the virtual environment. You should see `(venv)` to the right of your terminal prompt, which indicates the virtual environment is now activated.

## `pip install -r requirements.txt`

The above command will install all the needed `python` libs in order to successfully boot the program via `python main.py`.

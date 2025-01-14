import os
import threading
from time import time

import watchfiles
import webview

import api as rag_api
from wa_async import WVAsync, JsApi


def open_file_dialog():
    for window in webview.windows:
        result = window.create_file_dialog(
            webview.FOLDER_DIALOG, allow_multiple=False, directory=os.getcwd()
        )
        return result


def fullscreen(self):
    webview.windows[0].toggle_fullscreen()


def save_content(self, content):
    filename = webview.windows[0].create_file_dialog(webview.SAVE_DIALOG)
    if not filename:
        return

    with open(filename, "w") as f:
        f.write(content)


def ls(self):
    return os.listdir(".")


def get_entrypoint():
    def exists(path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))

    if exists("../gui/index.html"):  # unfrozen development
        return "../gui/index.html"

    if exists("../Resources/gui/index.html"):  # frozen py2app
        return "../Resources/gui/index.html"

    if exists("./gui/index.html"):
        return "./gui/index.html"

    raise Exception("No index.html found")


def set_interval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop():  # executed in another thread
                while not stopped.wait(interval):  # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True  # stop if the program exits
            t.start()
            return stopped

        return wrapper

    return decorator


entry = get_entrypoint()


def update_ticker():
    if len(webview.windows) > 0:

        current_path = os.path.dirname(__file__)
        print(current_path)

        for change in watchfiles.watch("./gui"):
            ## using this instead of window.load_url() because that didn't work for me
            window.evaluate_js('window.location.reload()')
            print(f"File {change} changed at {time()}")


# add user function
class Js(JsApi):
    def version(self):
        print("version")


if __name__ == "__main__":
    wv_app = WVAsync()
    js_api = Js(wv_app.jq)

    wv_app.registry("open_project", rag_api.open_project)
    wv_app.registry("initialize_rag", rag_api.initialize_rag)
    wv_app.registry("analyze_code", rag_api.analyze_code)
    wv_app.registry("process_codebase", rag_api.process_codebase)

    window = webview.create_window("Ceylon AI - Dev Friend", entry, js_api=js_api)
    window.expose(open_file_dialog)
    window.expose(fullscreen)
    window.expose(save_content)
    window.expose(ls)
    wv_app.start(window)
    webview.start(update_ticker, debug=True)

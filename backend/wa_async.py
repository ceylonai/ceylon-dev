import asyncio
from threading import Thread

import janus


class WVAsync:
    def __init__(self):
        self.jq = janus.Queue()
        self.js_api = JsApi(self.jq)
        self.window = None
        self._t = Thread(target=self._main)
        self._reg = {}  # {fn_name: fn}

    def registry(self, name, fn):
        self._reg[name] = fn

    def _on_closing(self):
        print('closing')
        self.jq.sync_q.put_nowait({'closing': True})

    def start(self, window):
        self.window = window
        self.window.events.closing += self._on_closing
        self._t.start()

    def _main(self):
        asyncio.run(self._main_loop())

    async def _main_loop(self):
        while True:  # ret = {name: {value}}
            ret = await self.jq.async_q.get()
            print(ret)
            for fn_name in ret:
                if fn_name in self._reg:
                    asyncio.create_task(self._reg[fn_name](ret[fn_name]))
                    await asyncio.sleep(0)
            if 'closing' in ret:
                break


class JsApi:
    def __init__(self, jq):
        self.jq = jq

    def call(self, rpc_name, d=None):
        print(rpc_name, d)
        self.jq.sync_q.put_nowait({rpc_name: d})

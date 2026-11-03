"""Check that incomplete dynamic data never replaces an existing index."""
from pathlib import Path
from unittest.mock import patch
import hashlib
import importlib.util
import runpy
import unittest

ROOT = Path(__file__).resolve().parents[1]


class IndexGuardTest(unittest.TestCase):
    def test_missing_dynamic_data_preserves_previous_index(self):
        output = ROOT / 'chatbot-verejny' / 'index.json'
        original_hash = hashlib.sha256(output.read_bytes()).digest()
        real_spec = importlib.util.spec_from_file_location

        def missing_dynamic(name, *args, **kwargs):
            spec = real_spec(name, *args, **kwargs)
            if name == 'local_chat':
                load = spec.loader.exec_module

                def load_without_dynamic(module):
                    load(module)
                    module.index_site = lambda **_kwargs: []

                spec.loader.exec_module = load_without_dynamic
            return spec

        with patch('importlib.util.spec_from_file_location', side_effect=missing_dynamic):
            with self.assertRaisesRegex(RuntimeError, 'Chybí dynamický obsah'):
                runpy.run_path(str(ROOT / 'chatbot-verejny' / 'build_index.py'))
        self.assertEqual(hashlib.sha256(output.read_bytes()).digest(), original_hash)


if __name__ == '__main__':
    unittest.main()

import shutil
import os

src = r"C:\Users\admin\.gemini\antigravity-ide\brain\3be22722-8f0a-4a05-89da-986700d1a6dc\payment_qr_final_1790965160685.jpg"
dst = r"C:\Users\admin\Desktop\amouracrafts\amouracrafts-1\images\payment-qr.jpg"

shutil.copy2(src, dst)
print(f"Copied to: {dst}")
print(f"File size: {os.path.getsize(dst)} bytes")

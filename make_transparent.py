from PIL import Image

def remove_background(img_path, out_path, tolerance=50):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    # Get top-left pixel as background color
    bg_color = datas[0]
    
    new_data = []
    for item in datas:
        # Calculate distance
        dist = ((item[0] - bg_color[0])**2 + (item[1] - bg_color[1])**2 + (item[2] - bg_color[2])**2)**0.5
        if dist < tolerance:
            # Fully transparent
            new_data.append((255, 255, 255, 0))
        elif dist < tolerance + 30:
            # Partial transparency for anti-aliasing
            alpha = int((dist - tolerance) / 30 * 255)
            new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print(f"Saved {out_path}")

remove_background('images/logo.jpg', 'images/logo.png', tolerance=40)

# import os
# import subprocess
# import webbrowser

# def run_server(folder_path):
#     # Change to the specified folder
#     os.chdir(folder_path)

#     # Open a command prompt and run the server command
#     subprocess.run(["start", "cmd", "/k", "node server.js"], shell=True)

#     # Open the web browser and visit localhost:3000
#     webbrowser.open("http://localhost:3000")

# if __name__ == "__main__":
#     folder_path = r"C:\Users\sahil\Desktop\Freelance\Final Year Project - nodejs"  # Replace with your folder path
#     run_server(folder_path)




#------------------------------------------------------#
# import os
# import subprocess
# import webbrowser
# import pyautogui
# import time

# def run_server(folder_path):
#     os.chdir(folder_path)

#     subprocess.Popen(["start", "cmd", "/k", "node server.js"], shell=True)

#     time.sleep(0.5)

#     pyautogui.hotkey('winleft', 'M')

#     webbrowser.open("http://localhost:3000")
    
#     time.sleep(0.5)
    
#     screenWidth, screenHeight = pyautogui.size()
#     pyautogui.click(screenWidth // 2, screenHeight // 2)

# if __name__ == "__main__":
#     folder_path = r"C:\Users\sahil\Desktop\Freelance\Final Year Project - nodejs"  # Replace with your folder path
#     run_server(folder_path)


#-------------------------------------------#
import os
import subprocess
import webbrowser
import pyautogui
import time

def run_server(folder_path):
    # Change to the specified folder
    os.chdir(folder_path)

    # Open a command prompt and run the server command
    subprocess.Popen(["start", "cmd", "/k", "node server.js"], shell=True)

    # Wait for a few seconds to ensure the server starts (adjust as needed)
    time.sleep(1)

    pyautogui.hotkey('winleft', 'down')

    webbrowser.open("http://localhost:3000")

    time.sleep(0.4)

    screenWidth, screenHeight = pyautogui.size()
    pyautogui.click(screenWidth // 2, screenHeight // 2)

if __name__ == "__main__":
    folder_path = r"C:\Users\sahil\Desktop\Freelance\Final Year Project - nodejs"  # Replace with your folder path
    run_server(folder_path)

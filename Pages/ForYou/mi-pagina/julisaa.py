import tkinter as tk
from PIL import Image, ImageTk
import time
import threading
import pygame

# ----------------------------
# CONFIGURACIÓN GENERAL
# ----------------------------
SONG_FILE = "Perfect.mp3"
BACKGROUND_IMAGE = "background.jpg"

subtitulos = [
    ("I found a love for me", 9.2),
    ("Oh, darling, just dive right in and follow my lead", 8.3),
    ("Well, I found a girl, beautiful and sweet", 7.8),
    ("Oh, I never knew you were the someone waitin' for me", 7.2),
    ("'Cause we were just kids when we fell in love, not knowin' what it was", 8),
    ("I will not give you up this time", 7.2),
    ("Oh, darling, just kiss me slow, your heart is all I own", 7.9),
    ("And in your eyes, you're holding mine", 6.0),
    ("Baby, I'm dancin' in the dark with you between my arms", 11.7),
    ("Barefoot on the grass while listenin' to our favourite song", 7.5),
    ("When you said you looked a mess, I whispered underneath my breath", 6.5),
    ("But you heard it, 'Darling, you look perfect tonight'", 13.6),
    ("Well, I found a woman", 3.2),
    ("Stronger than anyone I know", 3.2),
    ("She shares my dreams, I hope that someday", 4.4),
    ("I'll share her home", 3.3),
    ("I found a love, to carry more than just my secrets", 8.3),
    ("To carry love, to carry children of our own", 6.9),
    ("We are still kids, but we are so in love", 4.5),
    ("Fighting against all odds", 3.7),
    ("I know we'll be alright this time", 7.9),
    ("Darling, just hold my hand, be my girl, I'll be your man", 6.5),
    ("I see my future in your eyes", 4.4),
    ("Baby, I'm dancing in the dark", 9.8),
]

# ----------------------------
# APP
# ----------------------------
class KaraokeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Karaoke Romántico")
        self.root.attributes("-fullscreen", True)
        self.is_playing = False
        self.paused = False

        # --- Screen size ---
        self.screen_w = root.winfo_screenwidth()
        self.screen_h = root.winfo_screenheight()

        # --- Load Background Image ---
        self.bg_image = Image.open(BACKGROUND_IMAGE).resize((self.screen_w, self.screen_h))
        self.bg_photo = ImageTk.PhotoImage(self.bg_image)
        self.bg_label = tk.Label(root, image=self.bg_photo)
        self.bg_label.place(relwidth=1, relheight=1)

        # --- Margins ---
        left_margin_cm = 3
        right_margin_cm = 2
        cm_to_px = 37

        total_margin_px = (left_margin_cm + right_margin_cm) * cm_to_px
        self.wraplength = self.screen_w - total_margin_px

        # --- Lyrics Label (CLEAN) ---
        self.lyric_label = tk.Label(
            root,
            text="",
            font=("Helvetica", 44, "bold"),
            fg="#FF69B4",       # Rosa fuerte
            bg=None,
            wraplength=self.wraplength,
            justify="left"
        )
        # Mueve el centro del texto un poco a la derecha pero no tanto
        self.lyric_label.place(relx=0.55, rely=0.5, anchor="center")

        # --- Control Buttons ---
        self.button_frame = tk.Frame(root, bg="black")
        self.button_frame.pack(side="bottom", pady=20)

        self.play_button = tk.Button(
            self.button_frame,
            text="▶️ Start",
            font=("Helvetica", 16),
            command=self.toggle_play,
            bg="#FF69B4",
            fg="white"
        )
        self.play_button.pack(side="left", padx=10)

        self.exit_button = tk.Button(
            self.button_frame,
            text="❌ Exit",
            font=("Helvetica", 16),
            command=root.destroy,
            bg="red",
            fg="white"
        )
        self.exit_button.pack(side="left", padx=10)

        # --- Pygame Mixer ---
        pygame.mixer.init()

    def toggle_play(self):
        if not self.is_playing:
            self.start_karaoke()
        elif self.paused:
            pygame.mixer.music.unpause()
            self.paused = False
            self.play_button.config(text="⏸️ Pause")
        else:
            pygame.mixer.music.pause()
            self.paused = True
            self.play_button.config(text="▶️ Resume")

    def start_karaoke(self):
        self.is_playing = True
        self.play_button.config(text="⏸️ Pause")
        threading.Thread(target=self.play_song_and_lyrics).start()

    def play_song_and_lyrics(self):
        pygame.mixer.music.load(SONG_FILE)
        pygame.mixer.music.play()

        for line, duration in subtitulos:
            self.show_line(line, duration)
            while self.paused:
                time.sleep(0.1)

        # --- Final message ---
        final_text = "🎵 I'll always think of you when I hear this song 🎵\nWith eternal affection 💌"
        self.lyric_label.config(
            text=final_text,
            fg="#FF69B4",
            font=("Helvetica", 36, "italic"),
            justify="center"
        )
        time.sleep(5)

    def show_line(self, line, duration):
        steps = 10
        step_time = 0.05

        # Fade in zoom effect
        for i in range(steps):
            size = 28 + (i * 1.8)
            self.lyric_label.config(text=line, font=("Helvetica", int(size), "bold"))
            time.sleep(step_time)
            while self.paused:
                time.sleep(0.1)

        # Stay
        time.sleep(max(duration - (steps * 2 * step_time), 0.5))

        # Fade out
        for i in range(steps):
            size = 46 - (i * 1.8)
            self.lyric_label.config(font=("Helvetica", int(size), "bold"))
            time.sleep(step_time)
            while self.paused:
                time.sleep(0.1)

# ----------------------------
# MAIN
# ----------------------------
if __name__ == "__main__":
    root = tk.Tk()
    app = KaraokeApp(root)
    root.mainloop()

# 🎮 Tic Tac Toe - Gra Online

Link do aplikacji: [Tic Tac Toe Online](https://tic-tac-toe-inky-eight-63.vercel.app/)

---

## 📋 **Opis Projektu**

Prosta gra **Tic Tac Toe** stworzona w ramach projektu na przedmiot **Frameworki Frontendowe**.  
Aplikacja umożliwia jednoosobową rozgrywkę oraz zapis i wczytywanie stanu gry przy użyciu Firebase.

---

## 🛠️ **Technologie**

- **Next.js 13** - framework React do budowy aplikacji.  
- **TypeScript** - statyczne typowanie kodu.  
- **Firebase** - autoryzacja użytkowników oraz baza danych Firestore.  
- **Tailwind CSS** - szybkie i wygodne stylowanie.  
- **Vercel** - hosting aplikacji.  

---

## 🚀 **Funkcjonalności**

- **Rejestracja i logowanie** - obsługa autoryzacji przez Firebase.  
- **Gra w Tic Tac Toe** - klasyczna rozgrywka z dynamiczną aktualizacją stanu gry.  
- **Personalizacja wyglądu** - możliwość zmiany kolorów planszy i znaków.  
- **Zapis i wczytywanie gry** - przechowywanie stanu gry w Firestore.  
- **Responsywność** - dostosowanie do urządzeń mobilnych.  

---

## 🧑‍💻 **Jak uruchomić projekt lokalnie?**

1 Sklonuj repozytorium:
   ```bash
   git clone https://github.com/nazwa-uzytkownika/nazwa-repozytorium.git
```
   Zainstaluj zależności:
   ```
   npm install
```
Utwórz plik .env.local i dodaj zmienne środowiskowe Firebase:
```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxx
```
Uruchom aplikację lokalnie:

```
npm run dev
```


   


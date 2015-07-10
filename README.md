##Tshirt creator

Aplikacja została napisane przy użyciu Spring Boot oraz JHipster.
JHipster jest generatorem szablonu aplikacji.
W przypadku tej aplikacji wygenerowany szablon został oczyszczony z paru niepotrzebnych rzeczy.

Aplikację można uruchomić poleceniem:
```
gradlew bootRun
```
Po uruchomieniu aplikacja dostępna jest pod adresem: [http://localhost:8080](http://localhost:8080)

Aplikacja została napisana przy wykorzystaniu języka Javascript oraz Java.

Część napisana w Javascipt odpowiada za:
* Wyznaczenie oraz zaznaczenie największego prostokątnego obszaru na koszulce.
* Wpisanie w wyznaczony obszar wprowadzone tekstu.
* Ustalenie maksymalnego rozmiaru czcionki, dla wprowadzonego tekstu i wyznaczonego obszaru.
* Zmianę obszaru "pisania" na koszulce.
* Eksport rysunku do formatu png.
* Wysłanie na serwer pliku png w celu transkodowania do formatu jpeg.

Część serwerowa odpowiada za transkodowanie obrazu do formatu jpeg oraz za serwowanie treści statycznych.


Aplikacja jest aplikację konkursową w ramach konkursu [http://pretius.com/confitura2015](http://pretius.com/confitura2015)
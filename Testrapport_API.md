# Testrapport API

## Inleiding

Dit testrapport beschrijft de geautomatiseerde tests voor de C# ASP.NET API van ScalpCentral. De tests richten zich op de belangrijkste API-contracten: correcte HTTP-statuscodes, juiste response-data, foutafhandeling en kritieke service-logica rond accounts.

De tests staan in `api.Tests` en kunnen worden uitgevoerd met:

```powershell
dotnet test ScalpCentral.sln
```

Laatste resultaat: 27 tests geslaagd, 0 gefaald.

## Risicotabel

| Onderdeel | Risico | Impact | Faalkans | Risicoklasse |
| --- | --- | --- | --- | --- |
| Account registreren | Dubbele e-mail of wachtwoord onveilig opgeslagen | Hoog | Middel | Hoog |
| Inloggen | Ongeldige login wordt toch geaccepteerd | Hoog | Middel | Hoog |
| Orders beheren | Verkeerde orderstatus bij ontbrekende of foutieve order | Hoog | Middel | Hoog |
| Producten ophalen/beheren | API geeft verkeerde data of crasht bij servicefouten | Middel | Middel | Middel |
| Winkelmand | Ongeldige cart input of servicefout geeft onduidelijke response | Middel | Middel | Middel |
| Sets ophalen | Lege filterquery veroorzaakt fout | Laag | Middel | Laag |

## Teststrategie

| Onderdeel | Testdiepgang | Testtechniek | Reden |
| --- | --- | --- | --- |
| Services | Unit tests | Mock repository | Businesslogica testen zonder database-afhankelijkheid |
| Controllers | Unit tests | Mock service | API-responsecontracten testen zonder externe systemen |
| Foutpaden | Unit tests | Exceptions/null-resultaten simuleren | Controleren dat de API voorspelbaar reageert |
| Integratie met database/Redis | Niet geautomatiseerd in deze set | Handmatig of later integratietests | Vereist testcontainers/testdatabase en stabiele testdata |

## Testgevallen En Resultaten

| Testgroep | Belangrijkste controles | Resultaat |
| --- | --- | --- |
| `UserServiceTests` | Dubbele e-mail wordt geweigerd, wachtwoord wordt gehasht, login accepteert alleen juiste hash | Geslaagd |
| `UsersControllerTests` | Users ophalen, registratie succes/fout, login unauthorized, user ophalen | Geslaagd |
| `OrderControllerTests` | Order ophalen, not found, created response, update id mismatch, delete no content/not found | Geslaagd |
| `ProductsControllerTests` | Producten ophalen, paging limit, product aanmaken, hard delete, onverwachte fout geeft 500 | Geslaagd |
| `CartControllerTests` | Null DTO geeft bad request, add/remove roept service aan, cart ophalen, servicefout geeft 500 | Geslaagd |
| `SetControllerTests` | Null filter wordt vervangen door lege filter en geeft OK response | Geslaagd |

## Defecten En Problemen

Tijdens het toevoegen van de tests zijn geen falende API-tests overgebleven. De bestaande API-build toont wel nullable warnings in:

- `api/Models/DTOs/Cart/CartItemDTO.cs`
- `api/Requests/LoginRequest.cs`
- `api/Repository/Set/SetRepository.cs`

Deze warnings blokkeren de tests niet, maar zijn wel aan te raden om op te lossen voor codekwaliteit.

## Conclusie En Aanbevelingen

De belangrijkste API-onderdelen zijn nu afgedekt met snelle en herhaalbare unit tests. Hiermee voldoet de API aan de Definition of Done-punten dat relevante tests aanwezig zijn en succesvol draaien.

Aanbevolen vervolgstap is het toevoegen van integratietests met een testdatabase en Redis-testinstantie, zodat ook SQL-query's, repositorygedrag en configuratie end-to-end gecontroleerd worden.

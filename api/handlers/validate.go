package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/truetandem/e-QIP-prototype/api/model/form"
)

// ValidateAddress checks if an entire address is valid
func ValidateAddress(w http.ResponseWriter, r *http.Request) {
	var address form.AddressField
	DecodeJSON(r.Body, &address)
	log.Printf("Validating Full Address: [%v]\n", address)

	_, err := address.Valid()
	EncodeErrJSON(w, err)
}

// ValidateCity checks if a city is valid
func ValidateCity(w http.ResponseWriter, r *http.Request) {
	city := mux.Vars(r)["city"]
	log.Printf("Validating City: [%v]\n", city)

	_, err := form.CityField(city).Valid()
	stack := form.NewErrorStack("City", err)
	EncodeErrJSON(w, stack)
}

// ValidateZipcode checks if a zipcode is valid
func ValidateZipcode(w http.ResponseWriter, r *http.Request) {
	zipcode := mux.Vars(r)["zipcode"]
	log.Printf("Validating Zipcode: [%v]\n", zipcode)

	_, err := form.ZipcodeField(zipcode).Valid()
	stack := form.NewErrorStack("Zipcode", err)
	EncodeErrJSON(w, stack)
}

// ValidateState checks if a state is valid
func ValidateState(w http.ResponseWriter, r *http.Request) {
	state := mux.Vars(r)["state"]
	log.Printf("Validating State: [%v]\n", state)

	_, err := form.StateField(state).Valid()
	stack := form.NewErrorStack("State", err)
	EncodeErrJSON(w, stack)
}

// ValidateSSN checks if a social security number is valid
func ValidateSSN(w http.ResponseWriter, r *http.Request) {
	ssn := mux.Vars(r)["ssn"]
	field := form.SSNField{
		SSN:        ssn,
		Applicable: true,
	}

	_, err := field.Valid()
	stack := form.NewErrorStack("SSN", err)
	EncodeErrJSON(w, stack)
}

// ValidatePassport checks if a passport number is valid
func ValidatePassport(w http.ResponseWriter, r *http.Request) {
	passport := mux.Vars(r)["passport"]
	log.Printf("Validating Passport Number: [%v]\n", passport)

	_, err := form.PassportField(passport).Valid()
	stack := form.NewErrorStack("Passport", err)
	EncodeErrJSON(w, stack)
}

// ValidateApplicantName validates information for a persons name
func ValidateApplicantName(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Applicant Name")

	var name form.NameField
	DecodeJSON(r.Body, &name)
	_, err := name.Valid()
	EncodeErrJSON(w, err)
}

// ValidateApplicantBirthplace validates information for a persons birthplace
func ValidateApplicantBirthplace(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Applicant Birthplace")

	var birthplace form.BirthPlaceField
	DecodeJSON(r.Body, &birthplace)
	_, err := birthplace.Valid()
	stack := form.NewErrorStack("Birthplace", err)
	EncodeErrJSON(w, stack)
}

// ValidateApplicantBirthdate validates a persons birthdate
func ValidateApplicantBirthdate(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Applicant Birthdate")

	var name form.BirthdateField
	DecodeJSON(r.Body, &name)
	_, err := name.Valid()
	stack := form.NewErrorStack("Birthdate", err)
	EncodeErrJSON(w, stack)
}

// ValidateHeight validates a persons height
func ValidateHeight(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Height")

	var height form.HeightField
	DecodeJSON(r.Body, &height)
	_, err := height.Valid()
	EncodeErrJSON(w, err)
}

// ValidateWeight validates a persons weight
func ValidateWeight(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Weight")

	weightVar := mux.Vars(r)["weight"]
	i, _ := strconv.ParseInt(weightVar, 10, 64)
	_, err := form.WeightField(i).Valid()
	stack := form.NewErrorStack("Weight", err)
	EncodeErrJSON(w, stack)
}

// ValidateHairColor validates a persons hair color
func ValidateHairColor(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Hair Color")

	hairVar := mux.Vars(r)["haircolor"]
	_, err := form.HairColorField(hairVar).Valid()
	stack := form.NewErrorStack("HairColor", err)
	EncodeErrJSON(w, stack)
}

// ValidateEyeColor validates a person eye color
func ValidateEyeColor(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Eye Color")

	eyeVar := mux.Vars(r)["eyecolor"]
	_, err := form.EyeColorField(eyeVar).Valid()
	stack := form.NewErrorStack("EyeColor", err)
	EncodeErrJSON(w, stack)
}

// ValidateSex validates a persons sex
func ValidateSex(w http.ResponseWriter, r *http.Request) {
	log.Println("Validating Sex")

	sexVar := mux.Vars(r)["sex"]
	_, err := form.SexField(sexVar).Valid()
	stack := form.NewErrorStack("Sex", err)
	EncodeErrJSON(w, stack)
}

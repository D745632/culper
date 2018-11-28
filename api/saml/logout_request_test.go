package saml

import (
	"fmt"
	"os"
	"strings"
	"testing"
)

// TestBasicRequestFormat just tests that NewLogoutRequest can run without generating any errors.
func TestBasicRequestFormat(t *testing.T) {

	req := newLogoutRequest("localhost", "admin", "session-id")

	output, err := req.xml()
	if err != nil {
		fmt.Printf("error: %v\n", err)
		t.Fatal("error")
	}

	fmt.Println(string(output))

	b64, err := req.base64()
	if err != nil {
		t.Fatal("weird to get the error here and not there.")
	}

	fmt.Println(b64)

}

func TestRequestSignature(t *testing.T) {

	fmt.Println(os.Getwd())

	req := newLogoutRequest("localhost", "admin", "session-id")

	testCrtFile := "testdata/test_cert.pem"
	testKeyFile := "testdata/test_key.pem"

	err := req.signRequest(testCrtFile, testKeyFile)
	if err != nil {
		t.Fatal("Error signing request", err)
	}

	output, err := req.xml()
	if err != nil {
		fmt.Printf("error: %v\n", err)
		t.Fatal("error")
	}

	fmt.Println(string(output))

	if !strings.Contains(string(output), "SignatureValue") {
		t.Fatal("No signature")
	}

}

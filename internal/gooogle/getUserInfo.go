package gooogle

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type googleUser struct {
	Email      string `json:"email"`
	Username   string `json:"name"`        // name ? username
	GivenName  string `json:"given_name"`  //first name
	FamilyName string `json:"family_name"` //surname
	Photo      string `json:"picture"`     //photo url
}

func GetUserInfo(accessToken string) (*googleUser, error) {
	url := "https://www.googleapis.com/oauth2/v3/userinfo"
	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	request.Header.Set("Authorization", "Bearer "+accessToken)
	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get user info: %s", resp.Status)
	}

	var user googleUser
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}
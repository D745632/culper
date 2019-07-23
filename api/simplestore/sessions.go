package simplestore

import (
	"database/sql"
	"time"

	"github.com/18F/e-QIP-prototype/api"
	"github.com/pkg/errors"
)

// CreateOrUpdateSession returns session key or error
func (s SimpleStore) CreateOrUpdateSession(accountID int, sessionKey string, expirationDate time.Time) error {
	createQuery := `INSERT INTO Sessions (session_key, account_id, expiration_date)
		VALUES ($1, $2, $3)
		ON CONFLICT (account_id) DO UPDATE
		SET session_key = $1, expiration_date = $3`

	_, createErr := s.db.Exec(createQuery, sessionKey, accountID, expirationDate)
	if createErr != nil {
		return errors.Wrap(createErr, "Failed to create or update session")
	}

	return nil
}

// DeleteSession removes a session record from the db
func (s SimpleStore) DeleteSession(sessionKey string) error {
	deleteQuery := "DELETE FROM sessions WHERE session_key = $1"

	sqlResult, deleteErr := s.db.Exec(deleteQuery, sessionKey)
	if deleteErr != nil {
		return errors.Wrap(deleteErr, "Failed to delete session")
	}

	rowsAffected, _ := sqlResult.RowsAffected()
	if rowsAffected == 0 {
		return api.ErrValidSessionNotFound
	}

	return nil
}

// SessionRow represents a row of data from the sessions table
type SessionRow struct {
	SessionKey     string    `db:"session_key"`
	AccountID      int       `db:"account_id"`
	ExpirationDate time.Time `db:"expiration_date"`
}

type sessionAccountRow struct {
	SessionRow
	api.Account
}

// FetchSessionAccount fetches an account and session data from the db
func (s SimpleStore) FetchSessionAccount(sessionKey string) (api.Account, error) {

	fetchQuery := `SELECT sessions.session_key, sessions.account_id, sessions.expiration_date,
		accounts.id, accounts.form_version, accounts.form_type, accounts.username,
		accounts.email, accounts.external_id
		FROM sessions, accounts
		WHERE sessions.account_id = accounts.id
		AND sessions.session_key = $1 AND sessions.expiration_date > $2`
	row := sessionAccountRow{}
	selectErr := s.db.Get(&row, fetchQuery, sessionKey, time.Now())
	if selectErr != nil {
		if selectErr == sql.ErrNoRows {
			return api.Account{}, api.ErrValidSessionNotFound
		}
		return api.Account{}, errors.Wrap(selectErr, "Couldn't find Session")
	}

	return row.Account, nil
}
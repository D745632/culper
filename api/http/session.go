package http

import (
	"context"
	"net/http"

	"github.com/18F/e-QIP-prototype/api"
)

// SessionCookieName is the name of the cookie that is used to store the session
const SessionCookieName = "eapp-session-key"

// SessionMiddleware is the session handler.
type SessionMiddleware struct {
	log     api.LogService
	session api.SessionService
}

// NewSessionMiddleware returns a configured SessionMiddleware
func NewSessionMiddleware(log api.LogService, session api.SessionService) *SessionMiddleware {
	return &SessionMiddleware{
		log,
		session,
	}
}

// Middleware for verifying session
func (service SessionMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		sessionCookie, cookieErr := r.Cookie(SessionCookieName)
		if cookieErr != nil {
			service.log.WarnError(api.RequestIsMissingSessionCookie, cookieErr, api.LogFields{})
			RespondWithStructuredError(w, api.RequestIsMissingSessionCookie, http.StatusUnauthorized)
			return
		}

		sessionKey := sessionCookie.Value
		account, session, err := service.session.GetAccountIfSessionIsValid(sessionKey)
		if err != nil {
			if err == api.ErrValidSessionNotFound {
				service.log.WarnError(api.SessionDoesNotExist, err, api.LogFields{})
				RespondWithStructuredError(w, api.SessionDoesNotExist, http.StatusUnauthorized)
				return
			}
			if err == api.ErrSessionExpired {
				service.log.WarnError(api.SessionExpired, err, api.LogFields{})
				RespondWithStructuredError(w, api.SessionExpired, http.StatusUnauthorized)
				return
			}
			service.log.WarnError(api.SessionUnexpectedError, err, api.LogFields{})
			RespondWithStructuredError(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}

		service.log.AddField("account_id", account.ID)

		newContext := SetAccountAndSessionInRequestContext(r, account, session)
		next.ServeHTTP(w, r.WithContext(newContext))
	})
}

// SessionCookieService writes session cookies to a response
type SessionCookieService struct {
	secure bool
}

// NewSessionCookieService returns a SessionCookieService
func NewSessionCookieService(secure bool) SessionCookieService {
	return SessionCookieService{
		secure,
	}
}

// AddSessionKeyToResponse adds the session cookie to a response given a valid sessionKey
func (s SessionCookieService) AddSessionKeyToResponse(w http.ResponseWriter, sessionKey string) {
	// LESSONS:
	// The domain must be "" for localhost to work
	// Safari will fuck up cookies if you have a .local hostname, chrome does fine
	// Secure must be false for http to work

	cookie := &http.Cookie{
		Secure:   s.secure,
		Name:     SessionCookieName,
		Value:    sessionKey,
		HttpOnly: true,
		Path:     "/",
		// Omit MaxAge and Expires to make this a session cookie.
		// Omit domain to default to the full domain
	}

	http.SetCookie(w, cookie)

}

// DeleteSessionCookie removes the session cookie
func DeleteSessionCookie(w http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:   SessionCookieName,
		MaxAge: -1,
	}
	http.SetCookie(w, cookie)
}

// -- Context Storage
type authContextKey string

const accountKey authContextKey = "ACCOUNT"
const sessionKey authContextKey = "SESSION"

// SetAccountAndSessionInRequestContext modifies the request's Context() to add the Account
func SetAccountAndSessionInRequestContext(r *http.Request, account api.Account, session api.Session) context.Context {
	accountContext := context.WithValue(r.Context(), accountKey, account)
	sessionContext := context.WithValue(accountContext, sessionKey, session)

	return sessionContext
}

// AccountAndSessionFromRequestContext gets the reference to the Account stored in the request.Context()
func AccountAndSessionFromRequestContext(r *http.Request) (api.Account, api.Session) {
	// This will panic if it is not set or if it's not an Account. That will always be a programmer
	// error so I think that it's worth the tradeoff for the simpler method signature.
	account := r.Context().Value(accountKey).(api.Account)
	session := r.Context().Value(sessionKey).(api.Session)
	return account, session
}

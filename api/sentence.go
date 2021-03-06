package api

import "encoding/json"

// Sentence is a basic input.
type Sentence struct {
	PayloadDescription          Payload `json:"Description" sql:"-"`
	PayloadExceedsYear          Payload `json:"ExceedsYear" sql:"-"`
	PayloadIncarcerated         Payload `json:"Incarcerated" sql:"-"`
	PayloadIncarcerationDates   Payload `json:"IncarcerationDates" sql:"-"`
	PayloadIncarcerationDatesNA Payload `json:"IncarcerationDatesNA" sql:"-"`
	PayloadProbationDates       Payload `json:"ProbationDates" sql:"-"`
	PayloadProbationDatesNA     Payload `json:"ProbationDatesNA" sql:"-"`

	Description          *Textarea      `json:"-" sql:"-"`
	ExceedsYear          *Branch        `json:"-" sql:"-"`
	Incarcerated         *Branch        `json:"-" sql:"-"`
	IncarcerationDates   *DateRange     `json:"-" sql:"-"`
	IncarcerationDatesNA *NotApplicable `json:"-" sql:"-"`
	ProbationDates       *DateRange     `json:"-" sql:"-"`
	ProbationDatesNA     *NotApplicable `json:"-" sql:"-"`
}

// Unmarshal bytes in to the entity properties.
func (entity *Sentence) Unmarshal(raw []byte) error {
	err := json.Unmarshal(raw, entity)
	if err != nil {
		return err
	}

	description, err := entity.PayloadDescription.Entity()
	if err != nil {
		return err
	}
	entity.Description = description.(*Textarea)

	exceedsYear, err := entity.PayloadExceedsYear.Entity()
	if err != nil {
		return err
	}
	entity.ExceedsYear = exceedsYear.(*Branch)

	incarcerated, err := entity.PayloadIncarcerated.Entity()
	if err != nil {
		return err
	}
	entity.Incarcerated = incarcerated.(*Branch)

	incarcerationDates, err := entity.PayloadIncarcerationDates.Entity()
	if err != nil {
		return err
	}
	entity.IncarcerationDates = incarcerationDates.(*DateRange)

	incarcerationDatesNA, err := entity.PayloadIncarcerationDatesNA.Entity()
	if err != nil {
		return err
	}
	entity.IncarcerationDatesNA = incarcerationDatesNA.(*NotApplicable)

	probationDates, err := entity.PayloadProbationDates.Entity()
	if err != nil {
		return err
	}
	entity.ProbationDates = probationDates.(*DateRange)

	probationDatesNA, err := entity.PayloadProbationDatesNA.Entity()
	if err != nil {
		return err
	}
	entity.ProbationDatesNA = probationDatesNA.(*NotApplicable)

	return err
}

// Marshal to payload structure
func (entity *Sentence) Marshal() Payload {
	if entity.Description != nil {
		entity.PayloadDescription = entity.Description.Marshal()
	}
	if entity.ExceedsYear != nil {
		entity.PayloadExceedsYear = entity.ExceedsYear.Marshal()
	}
	if entity.Incarcerated != nil {
		entity.PayloadIncarcerated = entity.Incarcerated.Marshal()
	}
	if entity.IncarcerationDates != nil {
		entity.PayloadIncarcerationDates = entity.IncarcerationDates.Marshal()
	}
	if entity.IncarcerationDatesNA != nil {
		entity.PayloadIncarcerationDatesNA = entity.IncarcerationDatesNA.Marshal()
	}
	if entity.ProbationDates != nil {
		entity.PayloadProbationDates = entity.ProbationDates.Marshal()
	}
	if entity.ProbationDatesNA != nil {
		entity.PayloadProbationDatesNA = entity.ProbationDatesNA.Marshal()
	}
	return MarshalPayloadEntity("sentence", entity)
}

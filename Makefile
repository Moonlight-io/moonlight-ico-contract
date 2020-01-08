ENVIRONMENT ?= "dev"

deploy:
	node -r dotenv/config scripts/deploy.js dotenv_config_path="config/${ENVIRONMENT}.env"

unit_test:
	ENVIRONMENT=${ENVIRONMENT} npm test

deploy_and_test:
	$(MAKE) deploy
	sleep 15
	$(MAKE) unit_test
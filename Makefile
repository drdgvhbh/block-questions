start:
	docker-compose build
	docker-compose down
	sudo rm -rf ./eosio/data/*
	docker-compose up
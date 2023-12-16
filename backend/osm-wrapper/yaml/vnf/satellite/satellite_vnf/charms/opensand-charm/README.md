# virtual-pc

## Description


## Usage

### Prepare the environment

```bash
sudo snap install juju --classic --channel 2.8/stable
sudo snap install lxd
lxd.init
juju bootstrap lxd
juju add-model test-virtual-pc
```

### Deploy (from the Store)

```bash
juju deploy cs:~charmed-osm/virtual-pc --channel edge
```

### Deploy (locally)

Build the charm:

```bash
virtualenv -p python3 venv
source venv/bin/activate
pip install -r requirements-dev.txt
pip install charmcraft
./venv/bin/charmcraft build
```

Deploy:

```bash
juju deploy ./virtual-pc.charm
```

## Developing

Create and activate a virtualenv with the development requirements:

    virtualenv -p python3 venv
    source venv/bin/activate
    pip install -r requirements-dev.txt

## Testing

The Python operator framework includes a very nice harness for testing
operator behaviour without full deployment. Just `run_tests`:

    ./run_tests

CollectionSpace CLI
===================

Requires the `csapi` client.

Quickstart
----------

```
# for now use module from github
npm install mark-cooper/cscli -g
cscli setup
```

**Import**

Import all records within a specified directory:

```bash
# create authorities
cscli import --type=personauthority --dir=examples/personauthorities

# add authority records (references authority)
cscli import --type=person --shortid=lcnaf --dir=examples/person/lcnaf
cscli import --type=person --shortid=person --dir=examples/person/person

# create cataloging records (may reference authority records)
cscli import --type=collectionobject --dir=examples/collectionobjects
```

---
CollectionSpace CLI
===================

Requires the `csapi` client.

Quickstart
----------

```
cscli setup # not yet
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
CollectionSpace CLI
===================

Requires the [csapi](https://github.com/mark-cooper/csapi) client.

Quickstart
----------

```
# for now use module from github
npm install mark-cooper/cscli -g
cscli setup
```

This will create a `.cscli` file under `~/` to store backend credentials.

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

**List**

List records by path:

```bash
cscli list --path=media --properties=title,uri

cscli list --path=personauthorities --properties=shortIdentifier,csid
# use csid from personauthorities to get person records
cscli list --path=personauthorities/92c6d196-d88e-4e0e-8dbb/items --properties=shortIdentifier,csid
```

Use `--format=csv` if required, otherwise `table` is the default.

**Nuke**

This will delete records from CollectionSpace referenced by `path` from a file of `uri` values. Use with caution!

---